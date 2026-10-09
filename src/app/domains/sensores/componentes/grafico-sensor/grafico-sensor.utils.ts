import * as echarts from 'echarts/core';
import { TelemetriaLog } from '../../../telemetria/modelos/telemetria.model';
import { SensorData } from '../../modelos/sensor.model';

export function getAccentColor(sensorId: string): string {
  switch(sensorId) {
    case 'temperatura': return '#fb923c';
    case 'humedad': return '#34d399';
    case 'tds': return '#a78bfa';
    case 'ph': return '#f472b6';
    case 'oxigeno': return '#60a5fa';
    case 'presion': return '#818cf8';
    case 'aire': return '#2dd4bf';
    case 'turbidez': return '#eab308';
    case 'agua': return '#38bdf8';
    case 'caudal': return '#f43f5e';
    case 'sedimento': return '#d97706';
    case 'temp_liquido': return '#ef4444';
    default: return '#38bdf8';
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mapLogField(sensorId: string, log: TelemetriaLog): number {
  switch (sensorId) {
    case 'temperatura': return log.temperatura;
    case 'humedad': return log.humedad;
    case 'ph': return log.ph;
    case 'oxigeno': return log.oxigeno;
    case 'presion': return log.presion;
    case 'aire': return log.aire;
    case 'tds': return log.tds;
    case 'turbidez': return log.turbidez;
    case 'sedimento': return log.sedimento;
    case 'temp_liquido': return log.temp_liquido;
    case 'agua': return log.aguaAnalogico;
    case 'caudal': return log.caudal;
    case 'volumen': return log.volumenLitros;
    default: return 0;
  }
}

export function buildChartOptions(sensor: SensorData, data: any[]): any {
  const accentColor = getAccentColor(sensor.id);
  const latestVal = data.length > 0 ? data[data.length - 1][1] : 0;
  
  return {
    animation: false,
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis', 
      backgroundColor: 'rgba(5, 5, 5, 0.85)',
      borderColor: hexToRgba(accentColor, 0.5),
      borderWidth: 1,
      borderRadius: 8,
      padding: [12, 16],
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 20,
      formatter: (params: any[]) => {
        if (!params || params.length === 0) return '';
        const time = echarts.format.formatTime('hh:mm:ss', params[0].value[0]);
        let tooltipHtml = `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-bottom: 8px; color: #64748b; letter-spacing: 1px;">${time}</div>`;
        
        params.forEach(p => {
          if (p.seriesId === 'pulse') return;
          let val = p.value[1];
          if (typeof val === 'number') val = val.toFixed(2);
          
          tooltipHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 24px; font-size: 13px; margin-top: 4px; font-family: 'Outfit', sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${p.color}; box-shadow: 0 0 8px ${p.color}"></span>
                <span style="color: #94a3b8; font-weight: 500;">${p.seriesName}</span>
              </div>
              <span style="color: #fff; font-weight: 800; font-family: 'JetBrains Mono', monospace;">${val} <span style="color: ${accentColor}; font-size: 10px;">${sensor.unidad}</span></span>
            </div>
          `;
        });
        return tooltipHtml;
      },
      textStyle: { color: '#f8fafc', fontFamily: 'Outfit', fontSize: 13, fontWeight: 'bold' },
      axisPointer: { 
        type: 'cross', 
        crossStyle: { color: hexToRgba(accentColor, 0.8), type: 'dashed', width: 1 },
        label: { backgroundColor: accentColor, color: '#fff', fontFamily: 'JetBrains Mono', fontWeight: 'bold', fontSize: 11, padding: [4, 8], borderRadius: 4 } 
      } 
    },
    grid: { left: '2%', right: '70px', bottom: '5%', top: '10%', containLabel: true },
    dataZoom: [ 
      { type: 'inside', xAxisIndex: 0, filterMode: 'none', zoomOnMouseWheel: true, moveOnMouseMove: true }
    ],
    xAxis: { 
      type: 'time', 
      boundaryGap: false,
      max: (val: any) => val.max + 15000, // Distancia futura como TradingView
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)', width: 1 } },
      axisLabel: { color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: 10, margin: 16 },
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.03)', type: 'dashed' } },
      axisPointer: { label: { formatter: (p: any) => echarts.format.formatTime('hh:mm:ss', p.value) } }
    },
    yAxis: { 
      type: 'value', 
      position: 'right',
      scale: true,
      boundaryGap: ['5%', '15%'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 'bold', formatter: `{value}`, margin: 12 },
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.03)', type: 'solid' } } 
    },
    series: [{ 
      id: 'main-series',
      name: sensor.nombre, 
      type: 'line', 
      smooth: false,
      symbol: 'none', 
      data: data, 
      itemStyle: { color: accentColor }, 
      lineStyle: { width: 3, color: accentColor, shadowColor: hexToRgba(accentColor, 0.6), shadowBlur: 12 }, 
      areaStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: hexToRgba(accentColor, 0.4) }, 
          { offset: 1, color: hexToRgba(accentColor, 0.0) }
        ]) 
      },
      markLine: {
        symbol: ['none', 'none'],
        label: { show: true, position: 'end', backgroundColor: accentColor, color: '#fff', padding: [4, 6], borderRadius: 4, fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: '900', formatter: (p: any) => p.value.toFixed(1) },
        lineStyle: { color: accentColor, type: 'solid', width: 1, shadowColor: hexToRgba(accentColor, 0.8), shadowBlur: 6 },
        data: [{ yAxis: latestVal }],
        animation: false
      },
      markArea: {
        silent: true,
        itemStyle: { opacity: 0.03 },
        data: [
          [
            { yAxis: sensor.min, itemStyle: { color: '#ef4444' } },
            { yAxis: -9999 }
          ],
          [
            { yAxis: sensor.max, itemStyle: { color: '#ef4444' } },
            { yAxis: 9999 }
          ],
          [
            { yAxis: sensor.min, itemStyle: { color: hexToRgba(accentColor, 0.5) } },
            { yAxis: sensor.max }
          ]
        ]
      }
    }]
  };
}



export function adjustZoomDelta(echartsInstance: any, delta: number) {
  if (!echartsInstance) return;
  const option = echartsInstance.getOption();
  const currentStart = option.dataZoom[0].start;
  const currentEnd = option.dataZoom[0].end;
  let newStart = Math.max(0, currentStart + delta);
  let newEnd = Math.min(100, currentEnd - delta);
  
  if (newEnd - newStart < 5) {
    const center = (currentStart + currentEnd) / 2;
    newStart = center - 2.5;
    newEnd = center + 2.5;
  }
  
  echartsInstance.dispatchAction({ type: 'dataZoom', start: newStart, end: newEnd });
}
export function calculateChartUpdate(echartsInstance: any, data: any[]): any {
  const latestVal = data.length > 0 ? data[data.length - 1][1] : 0;
  
  let newOptions: any = { 
    series: [{ id: 'main-series', name: echartsInstance.getOption()?.series[0]?.name || 'Sensor', data, markLine: { data: [{ yAxis: latestVal }] } }] 
  };

  if (echartsInstance && data.length >= 2) {
    const option = echartsInstance.getOption();
    const dataZoom = option.dataZoom && option.dataZoom[0];
    
    if (dataZoom && dataZoom.endValue !== undefined && dataZoom.startValue !== undefined) {
      const t1 = new Date(data[data.length - 1][0] as Date).getTime();
      const t2 = new Date(data[data.length - 2][0] as Date).getTime();
      const dt = t1 - t2;
      
      const isPinnedToRight = dataZoom.end >= 99.9 || (dataZoom.endValue >= t2);
      if (isPinnedToRight) {
        newOptions.dataZoom = [{
          startValue: dataZoom.startValue + dt,
          endValue: dataZoom.endValue + dt
        }];
      }

    }
  }
  return newOptions;
}
