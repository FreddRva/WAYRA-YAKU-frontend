import { EstadoSensor } from '../../sensores/modelos/sensor.model';

export interface TelemetriaLog {
  hora: Date;
  temperatura: number;
  humedad: number;
  ph: number;
  oxigeno: number;
  presion: number;
  aire: number;
  tds: number;
  turbidez: number;
  sedimento: number;
  temp_liquido: number;
  aguaAnalogico: number;
  caudal: number;
  volumenLitros: number;
  estado: EstadoSensor;
  anomalousSensors?: string[];
}
