import { SensorData, EstadoSensor, TelemetriaPaquete } from '../../domains/sensores/modelos/sensor.model';

export const INITIAL_SENSORS: SensorData[] = [
  // FASE 01: Pre-Filtración (Control de Entrada) - ESP32-01
  { 
    id: 'temperatura', 
    nombre: 'Temperatura Ambiente', 
    subtitulo: 'Sensor Digital DHT22 (Pin 25)', 
    valor: 0, 
    unidad: '°C', 
    icono: 'thermostat', 
    min: -10, 
    max: 50, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 36,
    horasOperativas: 720,
    saludPorcentaje: 98,
    proximoMantenimiento: 'En 180 días (Inspección)',
    espOrigen: 'ESP32-01',
    fase: 'Fase 01: Pre-Filtración',
    tipoSensor: 'Termistor NTC de precisión'
  },
  { 
    id: 'humedad', 
    nombre: 'Humedad Relativa', 
    subtitulo: 'Sensor Digital DHT22 (Pin 25)', 
    valor: 0, 
    unidad: '%', 
    icono: 'water_drop', 
    min: 0, 
    max: 100, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 36,
    horasOperativas: 720,
    saludPorcentaje: 98,
    proximoMantenimiento: 'En 180 días (Inspección)',
    espOrigen: 'ESP32-01',
    fase: 'Fase 01: Pre-Filtración',
    tipoSensor: 'Polímero capacitivo'
  },
  { 
    id: 'agua', 
    nombre: 'Nivel / Lluvia Bofedal', 
    subtitulo: 'Rain Drop Sensor (Pin 32)', 
    valor: 0, 
    unidad: 'ADC', 
    icono: 'water', 
    min: 0, 
    max: 4095, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 24,
    horasOperativas: 720,
    saludPorcentaje: 94,
    proximoMantenimiento: 'En 90 días (Limpieza de pistas)',
    espOrigen: 'ESP32-01',
    fase: 'Fase 01: Pre-Filtración',
    tipoSensor: 'Pistas conductoras doradas'
  },
  { 
    id: 'suelo', 
    nombre: 'Humedad Suelo Bofedal', 
    subtitulo: 'Capacitive Moisture (Pin 34)', 
    valor: 0, 
    unidad: 'ADC', 
    icono: 'grass', 
    min: 0, 
    max: 4095, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 24,
    horasOperativas: 720,
    saludPorcentaje: 95,
    proximoMantenimiento: 'En 90 días (Inspección)',
    espOrigen: 'ESP32-01',
    fase: 'Fase 01: Pre-Filtración',
    tipoSensor: 'Capacitivo anticorrosión V1.2'
  },

  // FASE 02: Filtrado Principal (Calidad y Flujo) - ESP32-02
  { 
    id: 'tds', 
    nombre: 'Pureza del Agua (TDS)', 
    subtitulo: 'TDS Meter V1.0 (Pin 35)', 
    valor: 0, 
    unidad: 'ppm', 
    icono: 'biotech', 
    min: 0, 
    max: 1000, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 24,
    horasOperativas: 720,
    saludPorcentaje: 96,
    proximoMantenimiento: 'En 60 días (Calibración)',
    espOrigen: 'ESP32-01',
    fase: 'Fase 02: Filtrado Principal',
    tipoSensor: 'Sonda de conductividad eléctrica'
  },
  { 
    id: 'turbidez', 
    nombre: 'Nivel de Turbidez', 
    subtitulo: 'Turbidity Sensor AO/DO (Pin 34)', 
    valor: 0, 
    unidad: 'NTU', 
    icono: 'opacity', 
    min: 0, 
    max: 100, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 18,
    horasOperativas: 720,
    saludPorcentaje: 91,
    proximoMantenimiento: 'En 30 días (Limpieza óptica)',
    espOrigen: 'ESP32-02',
    fase: 'Fase 02: Filtrado Principal',
    tipoSensor: 'Óptico Infrarrojo Disperso'
  },
  { 
    id: 'ph', 
    nombre: 'Nivel de pH del Agua', 
    subtitulo: 'Sensor Analógico pH-4502C (Pin 35)', 
    valor: 7, 
    unidad: 'pH', 
    icono: 'science', 
    min: 0, 
    max: 14, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 12,
    horasOperativas: 720,
    saludPorcentaje: 88,
    proximoMantenimiento: 'En 25 días (Solución Buffer pH 7/4)',
    espOrigen: 'ESP32-02',
    fase: 'Fase 02: Filtrado Principal',
    tipoSensor: 'Electrodo combinado de vidrio'
  },
  { 
    id: 'caudal', 
    nombre: 'Caudal de Flujo', 
    subtitulo: 'YF-S201 Water Flow (Pin 25)', 
    valor: 0, 
    unidad: 'L/min', 
    icono: 'speed', 
    min: 0, 
    max: 30, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 36,
    horasOperativas: 720,
    saludPorcentaje: 95,
    proximoMantenimiento: 'En 120 días (Inspección rotor)',
    espOrigen: 'ESP32-02',
    fase: 'Fase 02: Filtrado Principal',
    tipoSensor: 'Efecto Hall turbina magnética'
  },

  // FASE 03: Post-Filtración y Entorno - ESP32-03
  { 
    id: 'presion', 
    nombre: 'Presión Atmosférica', 
    subtitulo: 'Sensor Barométrico BMP280', 
    valor: 0, 
    unidad: 'hPa', 
    icono: 'compress', 
    min: 500, 
    max: 1100, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 48,
    horasOperativas: 720,
    saludPorcentaje: 99,
    proximoMantenimiento: 'En 365 días',
    espOrigen: 'ESP32-03',
    fase: 'Fase 03: Post-Filtración',
    tipoSensor: 'Piezorresistivo MEMS I2C'
  },
  { 
    id: 'aire', 
    nombre: 'Intensidad Luz Solar UV', 
    subtitulo: 'CJMCU GUVA-S12SD (Pin 32)', 
    valor: 0, 
    unidad: 'ADC', 
    icono: 'wb_sunny', 
    min: 0, 
    max: 4095, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 36,
    horasOperativas: 720,
    saludPorcentaje: 97,
    proximoMantenimiento: 'En 180 días (Limpieza fotodiodo)',
    espOrigen: 'ESP32-03',
    fase: 'Fase 03: Post-Filtración',
    tipoSensor: 'Fotodiodo UV Schottky GaN'
  },
  { 
    id: 'sedimento', 
    nombre: 'Calidad de Aire / Sedimento', 
    subtitulo: 'Sensor MQ135 (Pin 35)', 
    valor: 0, 
    unidad: 'PPM', 
    icono: 'blur_on', 
    min: 0, 
    max: 1000, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 18,
    horasOperativas: 720,
    saludPorcentaje: 92,
    proximoMantenimiento: 'En 60 días (Precalentamiento)',
    espOrigen: 'ESP32-03',
    fase: 'Fase 03: Post-Filtración',
    tipoSensor: 'Semiconductor SnO2 calentado'
  },
  { 
    id: 'temp_liquido', 
    nombre: 'Temperatura Líquido', 
    subtitulo: 'Termistor NTC 10K (Pin 34)', 
    valor: 0, 
    unidad: '°C', 
    icono: 'device_thermostat', 
    min: -5, 
    max: 80, 
    estado: 'advertencia', 
    historial: [], 
    minimo: 0, 
    maximo: 0, 
    promedio: 0, 
    tendencia: 'estable',
    fechaInstalacion: '14/10/2026',
    vidaUtilMeses: 36,
    horasOperativas: 720,
    saludPorcentaje: 98,
    proximoMantenimiento: 'En 180 días',
    espOrigen: 'ESP32-03',
    fase: 'Fase 03: Post-Filtración',
    tipoSensor: 'Termistor NTC blindado IP68'
  }
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
