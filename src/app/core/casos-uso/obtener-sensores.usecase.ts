import { Injectable, inject } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { concatMap, map, catchError, repeat, retry } from 'rxjs/operators';
import { SENSOR_REPOSITORY_TOKEN, ISensorRepository } from '../interfaces/sensor.repository.interface';
import { TelemetriaPaquete } from '../../domains/sensores/modelos/sensor.model';

@Injectable({
  providedIn: 'root',
})
export class ObtenerSensoresUseCase {
  private readonly sensorRepo: ISensorRepository = inject(SENSOR_REPOSITORY_TOKEN);

  ejecutar(intervaloMs: number = 500): Observable<TelemetriaPaquete | null> {
    return of(null).pipe(
      concatMap(() =>
        this.sensorRepo.obtenerTelemetria().pipe(
          map((p) => ({ ...p, timestamp: p.timestamp || new Date() })),
          retry(2), // Tolerate up to 2 dropped pings before failing
          catchError((err) => {
            return of(null);
          })
        )
      ),
      repeat({ delay: () => timer(intervaloMs) })
    );
  }


  setApiUrl(url: string): void { this.sensorRepo.setApiUrl(url); }
  getApiUrl(): string { return this.sensorRepo.getApiUrl(); }
  resetearVolumen(): Observable<{ mensaje: string }> { return this.sensorRepo.resetearVolumen(); }
}
