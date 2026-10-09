import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetriaPaquete } from '../../domains/sensores/modelos/sensor.model';

export interface ISensorRepository {
  obtenerTelemetria(): Observable<TelemetriaPaquete>;
  resetearVolumen(): Observable<{ mensaje: string }>;
  setApiUrl(url: string): void;
  getApiUrl(): string;
}

export const SENSOR_REPOSITORY_TOKEN = new InjectionToken<ISensorRepository>('ISensorRepository');

