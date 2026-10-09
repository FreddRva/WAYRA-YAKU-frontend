import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { IMotorRepository } from '../../core/interfaces/motor.repository.interface';
import { DireccionMotor, RespuestaMotor } from '../../domains/motores/modelos/motor.model';
import { SENSOR_REPOSITORY_TOKEN, ISensorRepository } from '../../core/interfaces/sensor.repository.interface';

/**
 * Implementación de infraestructura del repositorio de control de motor.
 */
@Injectable({
  providedIn: 'root',
})
export class MotorRepositoryImpl implements IMotorRepository {
  private readonly http = inject(HttpClient);
  private readonly sensorRepo: ISensorRepository = inject(SENSOR_REPOSITORY_TOKEN);

  enviarComando(direccion: DireccionMotor): Observable<RespuestaMotor> {
    const timestamp = new Date();
    const apiUrl = this.sensorRepo.getApiUrl();

    return this.http
      .post<{ status: string; message?: string }>(`${apiUrl}/motor`, { direccion })
      .pipe(
        timeout(2000),
        map((res) => ({
          exito: true,
          mensaje: res.message || `Motor ejecutó: ${direccion}`,
          comando: direccion,
          timestamp,
        })),
        catchError((err) => {
          // Error enviando comando
          return of({
            exito: false,
            mensaje: `Fallo al enviar comando al motor (${direccion}): ${err.message || 'Sin respuesta'}`,
            comando: direccion,
            timestamp,
          });
        })
      );
  }
}
