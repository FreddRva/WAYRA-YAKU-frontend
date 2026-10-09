import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ObtenerSensoresUseCase } from '../casos-uso/obtener-sensores.usecase';
import { SensorData } from '../../domains/sensores/modelos/sensor.model';
import { TelemetriaLog } from '../../domains/telemetria/modelos/telemetria.model';
import { INITIAL_SENSORS, procesarSensores } from '../estado/telemetria.store';

@Injectable({ providedIn: 'root' })
export class TelemetryStateService {
  private readonly sensoresUseCase = inject(ObtenerSensoresUseCase);
  private readonly http = inject(HttpClient);

  private subTelemetria?: Subscription;
  private aiInterval: any;

  readonly conectado = signal(false);
  readonly ultimaActualizacion = signal(new Date());
  readonly intervaloMs = signal(500);
  readonly totalMuestras = signal(0);
  readonly volumenTotalLitros = signal(0);
  readonly sensores = signal<SensorData[]>(INITIAL_SENSORS);
  readonly logsRecientes = signal<TelemetriaLog[]>([]);
  readonly aiDiagnostic = signal<any>(null);

  // Agrupación (Fases)
  readonly sensoresFase1 = computed(() => this.sensores().filter(s => ['temperatura', 'humedad', 'agua', 'suelo'].includes(s.id)));
  readonly sensoresFase2 = computed(() => this.sensores().filter(s => ['tds', 'caudal', 'ph', 'turbidez'].includes(s.id)));
  readonly sensoresFase3 = computed(() => this.sensores().filter(s => ['presion', 'aire', 'sedimento', 'temp_liquido'].includes(s.id)));

  readonly fase1Activa = computed(() => this.conectado() && this.sensoresFase1().length > 0);
  readonly fase2Activa = computed(() => this.conectado() && this.sensoresFase2().length > 0);
  readonly fase3Activa = computed(() => this.conectado() && this.sensoresFase3().length > 0);

  readonly ipEsp1 = signal(this.getInitialIp(1, '192.168.1.75'));
  readonly ipEsp2 = signal(this.getInitialIp(2, '192.168.100.98'));
  readonly ipEsp3 = signal(this.getInitialIp(3, '192.168.100.99'));
  readonly apiUrl = signal(this.getApiUrl());

  private getApiUrl(): string {
    return typeof localStorage !== 'undefined' ? (localStorage.getItem('api_url') || 'https://wayra-yaku-backend.onrender.com') : 'https://wayra-yaku-backend.onrender.com';
  }

  setApiUrl(url: string) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('api_url', url);
    this.apiUrl.set(url);
  }

  private getInitialIp(espIndex: number, defaultIp: string): string {
    const saved =
      typeof localStorage !== 'undefined' ? localStorage.getItem(`esp32_${espIndex}_ip`) : null;
    return saved || defaultIp;
  }

  iniciar(intervalo: number = 1000) {
    this.intervaloMs.set(intervalo);
    this.cargarHistorial();
  }

  detener() {
    this.subTelemetria?.unsubscribe();
    if (this.simInterval) clearInterval(this.simInterval);
  }

  private cargarHistorial() {
    this.http
      .get<any[]>(`${this.apiUrl()}/api/telemetry/history`)
      .pipe(timeout(5000))
      .subscribe({
        next: (history) => {
          const parsed = history.map((h) => ({
            hora: new Date(h.hora),
            temperatura: h.temperatura,
            humedad: h.humedad,
            ph: h.ph || 7,
            suelo: h.suelo || 0,
            presion: h.presion || 0,
            aire: h.aire || 0,
            tds: h.tds,
            turbidez: h.turbidez || 0,
            sedimento: h.sedimento || 0,
            temp_liquido: h.temp_liquido || 0,
            aguaAnalogico: h.aguaAnalogico,
            caudal: h.caudal,
            volumenLitros: h.volumen,
            estado: 'normal' as const,
          }));
          this.logsRecientes.set(parsed.reverse());
          this.iniciarLecturas();
        },
        error: () => {
          this.iniciarLecturas();
        },
      });
  }

  private simInterval: any;
  private lastRes1: any = null;
  private lastRes2: any = null;
  private lastRes3: any = null;

  iniciarLecturas(): void {
    this.subTelemetria?.unsubscribe();
    this.conectado.set(true);

    // Iniciar peticiones a la nube (Consumidor) en lugar de consultar a las placas locales
    this.pollBackend();

    if (this.simInterval) clearInterval(this.simInterval);
    this.simInterval = setInterval(() => {
      this.updateState();
    }, this.intervaloMs() || 1000);
  }

  private pollBackend() {
    if (!this.conectado()) return;
    this.http.get<any>(`${this.apiUrl()}/api/telemetry/latest`).pipe(timeout(3000)).subscribe({
      next: (res) => { 
        if (res && Object.keys(res).length > 0) {
          this.lastRes1 = res;
          this.aiDiagnostic.set({
            is_anomaly: res.is_anomaly,
            anomaly_score: res.anomaly_score,
            status: res.status,
            anomalous_sensors: res.anomalous_sensors
          });
        }
      },
      error: () => { 
        setTimeout(() => this.pollBackend(), this.intervaloMs() || 2000); 
      },
      complete: () => { 
        setTimeout(() => this.pollBackend(), this.intervaloMs() || 2000); 
      }
    });
  }

  private updateState() {
    try {
      const now = new Date();
      const res1 = this.lastRes1;
      const res2 = this.lastRes2;
      const res3 = this.lastRes3;

      const caudalActual = res1?.caudal ?? 0;
      
      const pkg: any = {
        timestamp: now,
        temperatura: res1?.temperatura ?? 0,
        humedad: res1?.humedad ?? 0,
        ph: res1?.ph ?? 0,
        suelo: res1?.suelo ?? 0,
        presion: res1?.presion ?? 0,
        aire: res1?.aire ?? 0,
        tds: res1?.tds ?? 0,
        turbidez: res1?.turbidez ?? 0,
        sedimento: res1?.sedimento ?? 0,
        temp_liquido: res1?.temp_liquido ?? 0,
        aguaAnalogico: res1?.aguaAnalogico ?? 0,
        caudalLMin: caudalActual,
        volumenLitros: this.volumenTotalLitros() + (caudalActual / 60)
      };

      this.ultimaActualizacion.set(pkg.timestamp);
      this.totalMuestras.update((n) => n + 1);
      this.volumenTotalLitros.set(pkg.volumenLitros);
      this.sensores.update((l) => procesarSensores(l, pkg, this.aiDiagnostic()?.anomalous_sensors || []));

      // Leer los valores ya procesados (nunca serán undefined) para evitar que la tabla HTML crashee
      const list = this.sensores();
      const valOf = (id: string) => list.find(s => s.id === id)?.valor ?? 0;

      const logs = this.logsRecientes();
      if (logs.length === 0 || now.getTime() - logs[0].hora.getTime() >= 900) {
        const newLog: TelemetriaLog = {
          hora: pkg.timestamp,
          temperatura: valOf('temperatura'),
          humedad: valOf('humedad'),
          ph: valOf('ph'),
          suelo: valOf('suelo'),
          presion: valOf('presion'),
          aire: valOf('aire'),
          tds: valOf('tds'),
          turbidez: valOf('turbidez'),
          sedimento: valOf('sedimento'),
          temp_liquido: valOf('temp_liquido'),
          aguaAnalogico: valOf('agua'),
          caudal: valOf('caudal'),
          volumenLitros: this.volumenTotalLitros(),
          estado: this.aiDiagnostic()?.is_anomaly ? 'anomalia' : 'normal',
          anomalousSensors: this.aiDiagnostic()?.anomalous_sensors || [],
        };
        this.logsRecientes.update((l) => [newLog, ...l].slice(0, 100));
      }
    } catch (ex) {
      // Ignorar error de procesamiento
    }
  }

  reiniciarVolumen(onSuccess: () => void, onError: () => void) {
    this.sensoresUseCase.resetearVolumen().subscribe({
      next: () => {
        this.volumenTotalLitros.set(0);
        onSuccess();
      },
      error: () => {
        this.volumenTotalLitros.set(0);
        onError();
      },
    });
  }

  setIp(espIndex: number, ip: string) {
    if (typeof localStorage !== 'undefined') localStorage.setItem(`esp32_${espIndex}_ip`, ip);
    if (espIndex === 1) {
      this.ipEsp1.set(ip);
    } else if (espIndex === 2) {
      this.ipEsp2.set(ip);
    } else if (espIndex === 3) {
      this.ipEsp3.set(ip);
    }
  }
}
