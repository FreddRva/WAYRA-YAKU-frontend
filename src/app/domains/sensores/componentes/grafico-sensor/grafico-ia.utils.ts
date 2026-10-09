import { SeriesOption } from 'echarts';

/**
 * Calcula la Media Móvil Simple (SMA)
 */
function calculateSMA(data: any[], windowSize: number): [Date, number][] {
  const smaData: [Date, number][] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      // Not enough data points yet, just copy or leave empty
      continue;
    }
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += data[i - j][1];
    }
    smaData.push([data[i][0], sum / windowSize]);
  }
  return smaData;
}

/**
 * Genera una línea de predicción futura (Forecast) muy simple basada en la pendiente reciente
 */
function generateForecast(data: any[]): [Date, number][] {
  if (data.length < 5) return [];
  const lastPoint = data[data.length - 1];
  const pastPoint = data[data.length - 5]; // 5 points ago
  
  const timeDiff = lastPoint[0].getTime() - pastPoint[0].getTime();
  const valDiff = lastPoint[1] - pastPoint[1];
  
  if (timeDiff === 0) return [];
  
  const slope = valDiff / timeDiff;
  
  // Predict next 15 seconds
  const forecast: [Date, number][] = [lastPoint];
  for (let i = 1; i <= 15; i++) {
    const futureTime = new Date(lastPoint[0].getTime() + (i * 1000));
    const futureVal = lastPoint[1] + (slope * (i * 1000));
    forecast.push([futureTime, futureVal]);
  }
  return forecast;
}

/**
 * Construye todas las series adicionales (Capas IA) que se inyectarán en ECharts
 */
export function buildAILayers(data: any[], showAdvanced: boolean, minVal: number, maxVal: number): any[] {
  if (data.length === 0) return [];
  
  const series: any[] = [];
  const lastPoint = data[data.length - 1];

  // 1. PULSO DE VIDA (effectScatter) - Siempre activo
  series.push({
    id: 'pulse',
    name: 'Pulse',
    type: 'effectScatter',
    coordinateSystem: 'cartesian2d',
    data: [lastPoint],
    symbolSize: 8,
    itemStyle: { color: '#38bdf8' },
    rippleEffect: { brushType: 'stroke', scale: 4 },
    zlevel: 1
  });

  // 2. MARCAS DE ANOMALÍAS (Rojitos)
  const anomaliesData = data.filter(d => d[2] === 'anomalia');
  if (anomaliesData.length > 0) {
    series.push({
      id: 'anomalies',
      name: 'Anomalía Detectada',
      type: 'effectScatter',
      coordinateSystem: 'cartesian2d',
      data: anomaliesData.map(d => [d[0], d[1]]),
      symbolSize: 12,
      itemStyle: { color: '#ef4444' }, // Rojo brillante
      rippleEffect: { brushType: 'stroke', scale: 3 },
      zlevel: 2
    });
  }

  // 3. CAPAS AVANZADAS
  const sma = showAdvanced ? calculateSMA(data, 10) : [];
  series.push({
    id: 'sma',
    name: 'SMA(10)',
    type: 'line',
    data: sma,
    smooth: true,
    lineStyle: { width: 2, color: 'rgba(234, 179, 8, 0.8)' }, // Amarillo
    showSymbol: false,
    zlevel: 0
  });

  const forecast = showAdvanced ? generateForecast(data) : [];
  series.push({
    id: 'forecast',
    name: 'Forecast',
    type: 'line',
    data: forecast,
    smooth: true,
    lineStyle: { 
      width: 3, 
      type: 'dashed',
      color: '#a855f7' // Morado brillante
    },
    showSymbol: false,
    zlevel: 0
  });

  return series;
}
