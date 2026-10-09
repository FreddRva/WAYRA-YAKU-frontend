export type EstadoSensor = 'normal' | 'advertencia' | 'alerta' | 'anomalia';

export interface SensorData {
  id: string;
  nombre: string;
  subtitulo: string;
  valor: number;
  unidad: string;
  icono: string;
  min: number;
  max: number;
  estado: EstadoSensor;
  historial: number[];
  minimo: number;
  maximo: number;
  promedio: number;
  tendencia: 'subiendo' | 'bajando' | 'estable';
  extraInfo?: string;
}

/** Estructura del JSON que entrega el endpoint GET /sensor del ESP32 */
export interface Esp32SensorResponse {
  error: boolean;
  mensaje?: string;
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
  agua: {
    analogico: number;
  };
  flujo: {
    caudal_l_min: number;
    volumen_litros: number;
  };
}

/** Paquete normalizado de telemetría procesado en el dominio */
export interface TelemetriaPaquete {
  timestamp: Date;
  temperatura: number;       // DHT22 (°C)
  humedad: number;           // DHT22 (%)
  ph: number;                // Sensor de pH
  oxigeno: number;           // Sensor de Oxígeno
  presion: number;           // Sensor de Presión
  aire: number;              // Sensor de Aire
  tds: number;               // TDS Meter V1.0 (ppm)
  turbidez: number;          // Sensor de Turbidez (NTU)
  sedimento: number;         // Sensor de Sedimento
  temp_liquido: number;      // Temperatura de Líquido (°C)
  aguaAnalogico: number;     // Water Sensor AO (0 - 4095 ADC)
  caudalLMin: number;        // YF-S201 Caudal (L/min)
  volumenLitros: number;     // YF-S201 Volumen acumulado (Litros)
}
