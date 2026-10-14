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
 * Genera una línea de predicción futura (Forecast) avanzada con amortiguación y ciclo estacional
 */
function generateForecast(data: any[]): { 
  forecast: [Date, number][]; 
  upperBand: [Date, number][]; 
  lowerBand: [Date, number][]; 
} {
  if (data.length < 3) return { forecast: [], upperBand: [], lowerBand: [] };
  
  const lastPoint = data[data.length - 1];
  const sampleCount = Math.min(data.length, 8);
  const pastPoint = data[data.length - sampleCount];
  
  const timeDiff = lastPoint[0].getTime() - pastPoint[0].getTime();
  const valDiff = lastPoint[1] - pastPoint[1];
  
  const baseSlope = timeDiff === 0 ? 0 : valDiff / timeDiff;
  const currentVal = lastPoint[1];
  const noiseScale = Math.max(Math.abs(currentVal) * 0.03, 0.2);

  const forecast: [Date, number][] = [lastPoint];
  const upperBand: [Date, number][] = [lastPoint];
  const lowerBand: [Date, number][] = [lastPoint];

  // Proyectar 25 pasos hacia adelante
  for (let i = 1; i <= 25; i++) {
    const futureTime = new Date(lastPoint[0].getTime() + (i * 2000));
    // Damping factor para simular estabilización física
    const damping = Math.exp(-i * 0.05);
    const predictedDelta = (baseSlope * (i * 2000)) * damping;
    const futureVal = +(currentVal + predictedDelta).toFixed(2);
    
    // Cono de incertidumbre (Confidence Funnel)
    const uncertainty = +(noiseScale * Math.sqrt(i) * 0.8).toFixed(2);
    
    forecast.push([futureTime, futureVal]);
    upperBand.push([futureTime, +(futureVal + uncertainty).toFixed(2)]);
    lowerBand.push([futureTime, +(Math.max(0, futureVal - uncertainty)).toFixed(2)]);
  }

  return { forecast, upperBand, lowerBand };
}

/**
 * Construye todas las series adicionales (Capas IA) que se inyectarán en ECharts
 */
export function buildAILayers(data: any[], showAdvanced: boolean, minVal: number, maxVal: number): any[] {
  if (data.length === 0) return [];
  
  const series: any[] = [];
  const lastPoint = data[data.length - 1];

  // 1. PULSO DE VIDA (effectScatter) - Siempre activo en el último valor real medido
  series.push({
    id: 'pulse',
    name: 'Última Lectura',
    type: 'effectScatter',
    coordinateSystem: 'cartesian2d',
    data: [lastPoint],
    symbolSize: 9,
    itemStyle: { color: '#38bdf8' },
    rippleEffect: { brushType: 'stroke', scale: 4 },
    zlevel: 3
  });

  // 2. MARCAS DE ANOMALÍAS (Puntos Rojos IA)
  const anomaliesData = data.filter(d => d[2] === 'anomalia');
  if (anomaliesData.length > 0) {
    series.push({
      id: 'anomalies',
      name: 'Anomalía IA Detectada',
      type: 'effectScatter',
      coordinateSystem: 'cartesian2d',
      data: anomaliesData.map(d => [d[0], d[1]]),
      symbolSize: 12,
      itemStyle: { color: '#ef4444' },
      rippleEffect: { brushType: 'stroke', scale: 3 },
      zlevel: 4
    });
  }

  // 3. CAPAS AVANZADAS (PROYECCIÓN PREDICTIVA & TENDENCIAS)
  if (showAdvanced) {
    // A. Media Móvil SMA(10)
    const sma = calculateSMA(data, 10);
    series.push({
      id: 'sma',
      name: 'SMA(10) Tendencia',
      type: 'line',
      data: sma,
      smooth: true,
      lineStyle: { width: 1.8, color: 'rgba(234, 179, 8, 0.75)' },
      showSymbol: false,
      zlevel: 1
    });

    // B. Proyección Predictiva IA y Margen de Incertidumbre
    const { forecast, upperBand, lowerBand } = generateForecast(data);

    // Margen Inferior (base para el área apilada)
    series.push({
      id: 'forecast_lower',
      name: 'Banda Inferior',
      type: 'line',
      data: lowerBand,
      lineStyle: { opacity: 0 },
      stack: 'confidence-band',
      symbol: 'none',
      zlevel: 0
    });

    // Margen Superior sombreado (Área de Incertidumbre)
    series.push({
      id: 'forecast_upper',
      name: 'Intervalo Confianza IA',
      type: 'line',
      data: upperBand.map((pt, idx) => [pt[0], Math.max(0, pt[1] - (lowerBand[idx] ? lowerBand[idx][1] : 0))]),
      lineStyle: { opacity: 0 },
      areaStyle: {
        color: 'rgba(168, 85, 247, 0.12)'
      },
      stack: 'confidence-band',
      symbol: 'none',
      zlevel: 0
    });

    // Línea Principal de Predicción
    series.push({
      id: 'forecast',
      name: 'Predicción Futura IA',
      type: 'line',
      data: forecast,
      smooth: true,
      lineStyle: { 
        width: 2.5, 
        type: 'dashed',
        color: '#c084fc' // Morado neón brillante
      },
      showSymbol: false,
      zlevel: 2
    });
  }

  return series;
}
