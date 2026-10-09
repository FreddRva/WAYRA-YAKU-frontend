import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MOTOR_REPOSITORY_TOKEN, IMotorRepository } from '../interfaces/motor.repository.interface';
import { DireccionMotor, RespuestaMotor } from '../../domains/motores/modelos/motor.model';

/**
 * Caso de uso: Controlar movimiento del motor.
 * Valida y envía comandos direccionales a través del puerto IMotorRepository.
 */
@Injectable({
  providedIn: 'root',
})
export class ControlarMotorUseCase {
  private readonly motorRepo: IMotorRepository = inject(MOTOR_REPOSITORY_TOKEN);

  /**
   * Ejecuta el comando de movimiento hacia una dirección
   */
  ejecutar(direccion: DireccionMotor): Observable<RespuestaMotor> {
    return this.motorRepo.enviarComando(direccion);
  }
}
