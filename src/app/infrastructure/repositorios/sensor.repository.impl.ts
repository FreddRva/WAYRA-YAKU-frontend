import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout, map } from 'rxjs/operators';
import { ISensorRepository } from '../../core/interfaces/sensor.repository.interface';
import {
  TelemetriaPaquete,
  Esp32SensorResponse,
} from '../../domains/sensores/modelos/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class SensorRepositoryImpl implements ISensorRepository {
  private readonly http = inject(HttpClient);
  private apiUrl = 'http://192.168.1.75/';

  private formatUrl(url: string): string {
    let clean = (url || '').trim().replace(/\/+$/, '');

    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `http://${clean}`;
    }
    return clean;
  }

  obtenerTelemetria(): Observable<TelemetriaPaquete> {
    const base = this.formatUrl(this.apiUrl);
    const targetUrl = `${base}/sensor?_t=${Date.now()}`;

    return this.http.get<Esp32SensorResponse>(targetUrl).pipe(
      timeout(8000),
      map((res) => this.mapearRespuesta(res))
    );
  }

  private mapearRespuesta(res: Esp32SensorResponse): TelemetriaPaquete {
    if (res.error) throw new Error(res.mensaje || 'Error ESP32');
    return {
      timestamp: new Date(),
      temperatura: typeof res.temperatura === 'number' ? res.temperatura : 0,
      humedad: typeof res.humedad === 'number' ? res.humedad : 0,
      ph: typeof res.ph === 'number' ? res.ph : 0,
      oxigeno: typeof res.oxigeno === 'number' ? res.oxigeno : 0,
      presion: typeof res.presion === 'number' ? res.presion : 0,
      aire: typeof res.aire === 'number' ? res.aire : 0,
      tds: typeof res.tds === 'number' ? res.tds : 0,
      turbidez: typeof res.turbidez === 'number' ? res.turbidez : 0,
      sedimento: typeof res.sedimento === 'number' ? res.sedimento : 0,
      temp_liquido: typeof res.temp_liquido === 'number' ? res.temp_liquido : 0,
      aguaAnalogico: res.agua?.analogico ?? 0,
      caudalLMin: res.flujo?.caudal_l_min ?? 0,
      volumenLitros: res.flujo?.volumen_litros ?? 0,
    };
  }

  resetearVolumen(): Observable<{ mensaje: string }> {
    const base = this.formatUrl(this.apiUrl);
    return this.http.get<{ mensaje: string }>(`${base}/reset-volumen`).pipe(
      timeout(8000),
      catchError(() => of({ mensaje: 'Volumen reiniciado localmente' })),
    );
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }
  getApiUrl(): string {
    return this.apiUrl;
  }
}
