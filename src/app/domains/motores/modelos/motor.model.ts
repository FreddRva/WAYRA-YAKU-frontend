export type DireccionMotor = 'arriba' | 'abajo' | 'izquierda' | 'derecha' | 'stop';

export interface ComandoMotor {
  direccion: DireccionMotor;
  velocidad?: number;
  pasos?: number;
  timestamp: Date;
}

export interface RespuestaMotor {
  exito: boolean;
  mensaje: string;
  comando: DireccionMotor;
  timestamp: Date;
}
