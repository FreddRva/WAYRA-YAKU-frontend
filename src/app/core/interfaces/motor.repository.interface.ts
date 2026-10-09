import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { DireccionMotor, RespuestaMotor } from '../../domains/motores/modelos/motor.model';

/**
 * Contrato del repositorio del motor (Puerto de salida en Clean Architecture).
 */
export interface IMotorRepository {
  /** Envía un comando direccional al motor */
  enviarComando(direccion: DireccionMotor): Observable<RespuestaMotor>;
}

/** Token de inyección para el puerto del motor */
export const MOTOR_REPOSITORY_TOKEN = new InjectionToken<IMotorRepository>('IMotorRepository');
