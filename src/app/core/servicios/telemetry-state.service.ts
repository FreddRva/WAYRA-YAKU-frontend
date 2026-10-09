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
  readonly sensoresFase1 = computed(() => this.sensores().filter(s => ['temperatura', 'humedad', 'tds', 'agua'].includes(s.id)));
  readonly sensoresFase2 = computed(() => this.sensores().filter(s => ['caudal', 'ph', 'oxigeno', 'turbidez'].includes(s.id)));
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
    this.pollAIDiagnostic();
    if (this.aiInterval) clearInterval(this.aiInterval);
    this.aiInterval = setInterval(() => this.pollAIDiagnostic(), 1000); // Polling cada segundo para no perder picos
  }

  detener() {
    this.subTelemetria?.unsubscribe();
    if (this.aiInterval) clearInterval(this.aiInterval);
  }

  private cargarHistorial() {
    this.http
      .get<any[]>('http://localhost:8000/api/telemetry/history')
      .pipe(timeout(1000))
      .subscribe({
        next: (history) => {
          const parsed = history.map((h) => ({
            hora: new Date(h.hora),
            temperatura: h.temperatura,
            humedad: h.humedad,
            ph: h.ph || 7,
            oxigeno: h.oxigeno || 0,
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

    // Iniciar peticiones a las placas (Productores)
    this.pollEsp1();
    this.pollEsp2();
    this.pollEsp3();

    // Iniciar el renderizado de la UI (Consumidor)
    // Esto asegura que Angular solo procese los gráficos 1 vez por segundo,
    // eliminando por completo el lag de CPU por sobre-actualización.
    if (this.simInterval) clearInterval(this.simInterval);
    this.simInterval = setInterval(() => {
      this.updateState();
    }, this.intervaloMs() || 1000);
  }

  private pollEsp1() {
    if (!this.conectado()) return;
    this.http.get<any>(`${this.apiUrl()}/proxy/esp/${this.ipEsp1()}`, { headers: { 'bypass-tunnel-reminder': 'true' } }).pipe(timeout(3000)).subscribe({
      next: (res) => { 
        if (res) {
          this.lastRes1 = res;
        }
      },
      error: (err) => { 
        setTimeout(() => this.pollEsp1(), this.intervaloMs() || 1000); 
      },
      complete: () => { setTimeout(() => this.pollEsp1(), this.intervaloMs() || 1000); }
    });
  }

  private pollEsp2() {
    if (!this.conectado()) return;
    this.http.get<any>(`${this.apiUrl()}/proxy/esp/${this.ipEsp2()}`, { headers: { 'bypass-tunnel-reminder': 'true' } }).pipe(timeout(3000)).subscribe({
      next: (res) => { if (res) this.lastRes2 = res; },
      error: () => { setTimeout(() => this.pollEsp2(), this.intervaloMs() || 1000); },
      complete: () => { setTimeout(() => this.pollEsp2(), this.intervaloMs() || 1000); }
    });
  }

  private pollEsp3() {
    if (!this.conectado()) return;
    this.http.get<any>(`${this.apiUrl()}/proxy/esp/${this.ipEsp3()}`, { headers: { 'bypass-tunnel-reminder': 'true' } }).pipe(timeout(3000)).subscribe({
      next: (res) => { if (res) this.lastRes3 = res; },
      error: () => { setTimeout(() => this.pollEsp3(), this.intervaloMs() || 1000); },
      complete: () => { setTimeout(() => this.pollEsp3(), this.intervaloMs() || 1000); }
    });
  }



  private updateState() {
    try {
      const now = new Date();
      const res1 = this.lastRes1;
      const res2 = this.lastRes2;
      const res3 = this.lastRes3;

      const caudalActual = res1?.flujo?.caudal_l_min ?? res1?.caudal ?? res1?.caudalLMin ?? res2?.caudal ?? 0;
      
      const pkg: any = {
        timestamp: now,
        temperatura: res1?.temperatura ?? res2?.temperatura,
        humedad: res1?.humedad ?? res2?.humedad,
        ph: res2?.ph ?? res1?.ph,
        oxigeno: res2?.oxigeno ?? res1?.oxigeno,
        presion: res3?.bmpPresion ?? res1?.presion,
        aire: res1?.aire ?? res3?.cjmcu,
        tds: res2?.tds ?? res1?.tds,
        turbidez: res2?.turbidez ?? res1?.turbidez,
        sedimento: res2?.sedimento ?? res1?.sedimento ?? res3?.flyingFishAO,
        temp_liquido: res3?.ntcTemperatura ?? res2?.temp_liquido,
        aguaAnalogico: res1?.agua?.analogico ?? res1?.aguaAnalogico ?? res2?.aguaAnalogico,
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
          oxigeno: valOf('oxigeno'),
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

  private pollAIDiagnostic() {
    const list = this.sensores();
    
    // Evitar consultar a la IA si los sensores aún no han cargado sus valores reales.
    // Esto evita que enviemos '0' a Python y genere un pico falso al arrancar.
    if (list.length === 0 || list.every(s => s.valor === 0)) {
      return;
    }

    const payload = {
      temperatura: list.find(s => s.id === 'temperatura')?.valor ?? 0,
      humedad: list.find(s => s.id === 'humedad')?.valor ?? 0,
      tds: list.find(s => s.id === 'tds')?.valor ?? 0,
      aguaAnalogico: list.find(s => s.id === 'agua')?.valor ?? 0,
      ph: list.find(s => s.id === 'ph')?.valor ?? 0,
      oxigeno: list.find(s => s.id === 'oxigeno')?.valor ?? 0,
      turbidez: list.find(s => s.id === 'turbidez')?.valor ?? 0,
      caudal: list.find(s => s.id === 'caudal')?.valor ?? 0,
      presion: list.find(s => s.id === 'presion')?.valor ?? 0,
      aire: list.find(s => s.id === 'aire')?.valor ?? 0,
      sedimento: list.find(s => s.id === 'sedimento')?.valor ?? 0,
      temp_liquido: list.find(s => s.id === 'temp_liquido')?.valor ?? 0
    };

    this.http.post(`${this.apiUrl()}/api/diagnostic`, payload, { headers: { 'bypass-tunnel-reminder': 'true' } }).subscribe({
      next: (res) => this.aiDiagnostic.set(res),
      error: () => {},
    });
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
