import { Component, Inject, Signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TelemetriaLog } from '../../../telemetria/modelos/telemetria.model';
import { SensorData } from '../../modelos/sensor.model';
import { GraficoSensorComponent } from '../grafico-sensor/grafico-sensor.component';
import { SensorAiPanelComponent } from '../sensor-ai-panel/sensor-ai-panel.component';
import { SensorKpisComponent } from '../sensor-kpis/sensor-kpis.component';
import { getSensorTendency, filterAnomaliesBySensor, filterRecommendationsBySensor } from '../../utilidades/sensor-ai.utils';

export interface SensorStatsData {
  sensorId: string;
  logsSignal: Signal<TelemetriaLog[]>;
  sensorSignal: Signal<SensorData[]>;
  aiSignal?: Signal<any>;
}

@Component({
  selector: 'app-sensor-stats-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, GraficoSensorComponent, SensorAiPanelComponent, SensorKpisComponent],
  templateUrl: './sensor-stats-dialog.component.html'
})
export class SensorStatsDialogComponent {
  sensor!: SensorData;
  min: number = 0;
  max: number = 0;
  avg: number = 0;
  
  get aiData() { return this.data.aiSignal ? this.data.aiSignal() : null; }
  
  get sensorField(): string {
    const m: any = { 
      'temperatura': 'temperatura', 
      'humedad': 'humedad', 
      'ph': 'ph', 
      'oxigeno': 'oxigeno', 
      'presion': 'presion', 
      'aire': 'aire', 
      'tds': 'tds', 
      'turbidez': 'turbidez',
      'agua': 'agua_analogico', 
      'caudal': 'caudal',
      'sedimento': 'sedimento',
      'temp_liquido': 'temp_liquido'
    };
    return m[this.data.sensorId] || '';
  }
  
  get sensorTendency(): string {
    return getSensorTendency(this.aiData, this.sensorField);
  }
  
  get filteredAnomalies(): any[] {
    return filterAnomaliesBySensor(this.aiData, this.sensorField);
  }

  get filteredRecommendations(): string[] {
    return filterRecommendationsBySensor(this.aiData, this.sensorField);
  }

  get accentColor(): string {
    const id = this.data.sensorId;
    if (id === 'temperatura') return '#fb923c';
    if (id === 'humedad') return '#34d399';
    if (id === 'tds') return '#a78bfa';
    if (id === 'ph') return '#f472b6';
    if (id === 'oxigeno') return '#60a5fa';
    if (id === 'presion') return '#818cf8';
    if (id === 'aire') return '#2dd4bf';
    if (id === 'turbidez') return '#eab308';
    if (id === 'agua') return '#38bdf8';
    if (id === 'caudal') return '#f43f5e';
    if (id === 'sedimento') return '#d97706';
    if (id === 'temp_liquido') return '#ef4444';
    return '#38bdf8';
  }

  constructor(
    public dialogRef: MatDialogRef<SensorStatsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SensorStatsData,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      const logs = this.data.logsSignal();
      const sensors = this.data.sensorSignal();
      const found = sensors.find(s => s.id === this.data.sensorId);
      
      if (found) {
        this.sensor = found;
        this.calcularMetricas(logs);
        this.cdr.detectChanges();
      }
    });
  }

  private mapLogField(log: TelemetriaLog): number {
    switch (this.data.sensorId) {
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

  private calcularMetricas(logs: TelemetriaLog[]) {
    if (logs.length === 0) return;
    const values = logs.map(l => this.mapLogField(l));
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.avg = values.reduce((a, b) => a + b, 0) / values.length;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
