import { SensorData, EstadoSensor, TelemetriaPaquete } from '../../domains/sensores/modelos/sensor.model';

export const INITIAL_SENSORS: SensorData[] = [
  { id: 'temperatura', nombre: 'Temperatura Ambiente', subtitulo: 'Sensor Digital DHT22 (Pin 4)', valor: 0, unidad: '°C', icono: 'thermostat', min: 0, max: 60, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'humedad', nombre: 'Humedad Relativa', subtitulo: 'Sensor Digital DHT22 (Pin 4)', valor: 0, unidad: '%', icono: 'water_drop', min: 0, max: 100, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'ph', nombre: 'Nivel de pH', subtitulo: 'Sensor de pH (Pin 34)', valor: 7, unidad: 'pH', icono: 'science', min: 0, max: 14, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'suelo', nombre: 'Humedad de Suelo', subtitulo: 'Capacitive Soil Moisture', valor: 0, unidad: 'ADC', icono: 'grass', min: 0, max: 4095, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'tds', nombre: 'Pureza del Agua (TDS)', subtitulo: 'TDS Meter V1.0 (Pin 35)', valor: 0, unidad: 'ppm', icono: 'biotech', min: 0, max: 1000, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'turbidez', nombre: 'Nivel de Turbidez', subtitulo: 'Turbidity Sensor (Pin 33)', valor: 0, unidad: 'NTU', icono: 'opacity', min: 0, max: 100, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'agua', nombre: 'Nivel / Detección Líquida', subtitulo: 'Water Level Sensor (Pin 32)', valor: 0, unidad: 'ADC', icono: 'water', min: 0, max: 4095, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'caudal', nombre: 'Caudal de Flujo', subtitulo: 'YF-S201 Water Flow (Pin 25)', valor: 0, unidad: 'L/min', icono: 'speed', min: 0, max: 30, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'presion', nombre: 'Presión Atmosférica', subtitulo: 'Sensor BMP280', valor: 0, unidad: 'hPa', icono: 'compress', min: 900, max: 1100, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'aire', nombre: 'Calidad de Aire', subtitulo: 'Sensor MQ135', valor: 0, unidad: 'PPM', icono: 'blur_on', min: 0, max: 1000, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'sedimento', nombre: 'Sedimento', subtitulo: 'Sensor de Sedimentos', valor: 0, unidad: 'mg/L', icono: 'layers', min: 0, max: 500, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' },
  { id: 'temp_liquido', nombre: 'Temperatura Líquido', subtitulo: 'Sensor DS18B20', valor: 0, unidad: '°C', icono: 'device_thermostat', min: 0, max: 100, estado: 'advertencia', historial: [], minimo: 0, maximo: 0, promedio: 0, tendencia: 'estable' }
];

export function calcularEstadoSensor(id: string, val: number): EstadoSensor {
  if (id === 'temperatura' || id === 'temp_liquido') return (val > 45 || val < 5) ? 'alerta' : val > 35 ? 'advertencia' : 'normal';
  if (id === 'humedad') return (val > 90 || val < 20) ? 'alerta' : (val > 80 || val < 30) ? 'advertencia' : 'normal';
  if (id === 'tds') return val > 600 ? 'alerta' : val > 400 ? 'advertencia' : 'normal';
  if (id === 'turbidez' || id === 'sedimento') return val > 50 ? 'alerta' : val > 20 ? 'advertencia' : 'normal';
  if (id === 'agua') return val > 3500 ? 'alerta' : val > 2500 ? 'advertencia' : 'normal';
  if (id === 'caudal') return val > 20 ? 'alerta' : 'normal';
  return 'normal';
}

export function procesarSensores(lista: SensorData[], pkg: TelemetriaPaquete, anomalousSensors: string[] = []): SensorData[] {
  const vals: Record<string, number> = {
    temperatura: pkg.temperatura, humedad: pkg.humedad,
    ph: pkg.ph, suelo: pkg.suelo, presion: pkg.presion, aire: pkg.aire,
    tds: pkg.tds, turbidez: pkg.turbidez, agua: pkg.aguaAnalogico, caudal: pkg.caudalLMin,
    sedimento: pkg.sedimento, temp_liquido: pkg.temp_liquido
  };

  return lista.map((s) => {
    const val = vals[s.id] ?? s.valor;
    const hist = [...s.historial, val].slice(-25);
    const min = Math.min(...hist);
    const max = Math.max(...hist);
    const prom = +(hist.reduce((a, b) => a + b, 0) / hist.length).toFixed(1);
    const dif = hist.length > 1 ? val - hist[hist.length - 2] : 0;
    const tendencia = dif > 0.05 ? 'subiendo' : dif < -0.05 ? 'bajando' : 'estable';

    // Mapeo del nombre del sensor (en Angular es 'agua', en Python es 'aguaAnalogico')
    const pythonSensorId = s.id === 'agua' ? 'aguaAnalogico' : s.id;
    const isAnomaly = anomalousSensors.includes(pythonSensorId);
    const baseState = calcularEstadoSensor(s.id, val);

    return {
      ...s,
      valor: val,
      estado: isAnomaly ? 'anomalia' : baseState,
      historial: hist,
      minimo: min,
      maximo: max,
      promedio: prom,
      tendencia,
    };
  });
}
