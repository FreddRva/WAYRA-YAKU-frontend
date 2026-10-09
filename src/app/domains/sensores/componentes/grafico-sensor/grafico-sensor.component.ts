import {
  Component,
  Input,
  effect,
  Signal,
  ChangeDetectorRef,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart, BarChart, ScatterChart, EffectScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkAreaComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { TelemetriaLog } from '../../../telemetria/modelos/telemetria.model';
import { SensorData } from '../../modelos/sensor.model';
import {
  buildChartOptions,
  mapLogField,
  adjustZoomDelta,
  calculateChartUpdate,
} from './grafico-sensor.utils';
import { buildAILayers } from './grafico-ia.utils';

// Registrar los módulos de ECharts necesarios
echarts.use([
  LineChart,
  BarChart,
  ScatterChart,
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent,
  MarkAreaComponent,
  CanvasRenderer,
]);

@Component({
  selector: 'app-grafico-sensor',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  providers: [provideEchartsCore({ echarts })],
  styleUrl: './grafico-sensor.css',
  templateUrl: './grafico-sensor.component.html',
})
export class GraficoSensorComponent {
  @Input({ required: true }) sensor!: SensorData;
  @Input({ required: true }) logsSignal!: Signal<TelemetriaLog[]>;
  timeframe: '10s' | '30s' | '1m' | 'ALL' = 'ALL';
  @Input() aiSignal?: Signal<any>;

  chartOptions: any;
  chartUpdate: any;
  private echartsInstance: any;

  isPaused = false;
  showAdvancedTools = false;
  isChartInitialized = false;

  private cdr = inject(ChangeDetectorRef);

  // Constants
  readonly MAX_POINTS = 500;

  constructor() {
    effect(() => {
      const allLogs = this.logsSignal();
      const logs = [...allLogs].slice(0, this.MAX_POINTS).reverse();
      
      if (!this.isPaused) {
        if (!this.isChartInitialized) {
          const data = logs.map(l => [l.hora, mapLogField(this.sensor.id, l), l.anomalousSensors?.includes(this.sensor.id === 'agua' ? 'aguaAnalogico' : this.sensor.id) ? 'anomalia' : 'normal'] as [Date, number, string]);
          this.chartOptions = buildChartOptions(this.sensor, data);
          
          // Inyectar IA Inicial
          const aiLayers = buildAILayers(data, this.showAdvancedTools, this.sensor.min, this.sensor.max);
          if (aiLayers.length > 0) {
            this.chartOptions.series = [...this.chartOptions.series, ...aiLayers];
          }
          
          this.isChartInitialized = true;
        } else {
          const data = logs.map(l => [l.hora, mapLogField(this.sensor.id, l), l.anomalousSensors?.includes(this.sensor.id === 'agua' ? 'aguaAnalogico' : this.sensor.id) ? 'anomalia' : 'normal'] as [Date, number, string]);
          const update = calculateChartUpdate(this.echartsInstance, data);
          
          // Inyectar IA Update
          const aiLayers = buildAILayers(data, this.showAdvancedTools, this.sensor.min, this.sensor.max);
          if (aiLayers.length > 0) {
            update.series = [...update.series, ...aiLayers];
          }
          
          if (this.echartsInstance) {
            this.echartsInstance.setOption(update);
          }
        }
      }
    });
  }

  toggleAdvancedTools(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.showAdvancedTools = !this.showAdvancedTools;
    // Forzar actualización inmediata de las capas IA sin esperar el próximo log
    this.forceRefreshAILayers();
  }

  private forceRefreshAILayers() {
    if (!this.echartsInstance || this.isPaused) return;
    const allLogs = this.logsSignal();
    const logs = [...allLogs].slice(0, this.MAX_POINTS).reverse();
    const data = logs.map(l => [l.hora, mapLogField(this.sensor.id, l), l.anomalousSensors?.includes(this.sensor.id === 'agua' ? 'aguaAnalogico' : this.sensor.id) ? 'anomalia' : 'normal'] as [Date, number, string]);
    const update = calculateChartUpdate(this.echartsInstance, data);
    const aiLayers = buildAILayers(data, this.showAdvancedTools, this.sensor.min, this.sensor.max);
    update.series = [...update.series, ...aiLayers];
    this.echartsInstance.setOption(update);
  }

  @HostListener('window:keydown.space', ['$event'])
  handleSpacebar(event: Event) {
    if (
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA'
    )
      return;
    event.preventDefault();
    this.togglePauseState();
  }

  onChartInit(ec: any) {
    this.echartsInstance = ec;
  }

  setTimeframe(tf: '10s' | '30s' | '1m' | 'ALL') {
    this.timeframe = tf;
    if (!this.echartsInstance) return;

    let windowMs = 0;
    if (tf === '10s') windowMs = 10000;
    else if (tf === '30s') windowMs = 30000;
    else if (tf === '1m') windowMs = 60000;

    if (windowMs === 0) {
      this.echartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
    } else {
      const option = this.echartsInstance.getOption();
      const rawSeries = option.series[0]?.data;
      if (rawSeries && rawSeries.length > 0) {
        const latestTime = new Date(rawSeries[rawSeries.length - 1][0] as Date).getTime();
        this.echartsInstance.dispatchAction({
          type: 'dataZoom',
          startValue: latestTime - windowMs,
          endValue: latestTime,
        });
      }
    }
  }
  togglePause(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    this.togglePauseState();
  }
  private togglePauseState() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      const allLogs = this.logsSignal();
      const logs = [...allLogs].slice(0, this.MAX_POINTS).reverse();
      const data = logs.map(l => [l.hora, mapLogField(this.sensor.id, l), l.anomalousSensors?.includes(this.sensor.id === 'agua' ? 'aguaAnalogico' : this.sensor.id) ? 'anomalia' : 'normal'] as [Date, number, string]);
      const update = calculateChartUpdate(this.echartsInstance, data);
      
      const aiLayers = buildAILayers(data, this.showAdvancedTools, this.sensor.min, this.sensor.max);
      update.series = [...update.series, ...aiLayers];
      
      if (this.echartsInstance) {
        this.echartsInstance.setOption(update);
      }
    }
  }
  zoomIn(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    adjustZoomDelta(this.echartsInstance, 10);
  }
  zoomOut(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    adjustZoomDelta(this.echartsInstance, -10);
  }
  restoreZoom(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
    }
  }
  downloadChart(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.echartsInstance) {
      const url = this.echartsInstance.getDataURL({ type: 'png', backgroundColor: '#0f172a' });
      const a = document.createElement('a');
      a.href = url;
      a.download = `grafica_${this.sensor.id}_${Date.now()}.png`;
      a.click();
    }
  }
}
