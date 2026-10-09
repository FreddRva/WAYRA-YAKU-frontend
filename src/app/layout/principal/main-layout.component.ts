import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryStateService } from '../../core/servicios/telemetry-state.service';
import { DashboardHeaderComponent } from '../encabezado/dashboard-header.component';
import { FiltrationPhaseComponent } from '../../domains/procesos/componentes/filtration-phase/filtration-phase.component';
import { TelemetryTableComponent } from '../../domains/telemetria/componentes/telemetry-table/telemetry-table.component';
import { SensorStatsDialogComponent } from '../../domains/sensores/componentes/sensor-stats-dialog/sensor-stats-dialog.component';
import { SensorData } from '../../domains/sensores/modelos/sensor.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MapaNodosComponent } from '../../domains/telemetria/componentes/mapa-nodos/mapa-nodos.component';
import { CameraDialogComponent } from '../../domains/telemetria/componentes/mapa-nodos/camera-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardHeaderComponent,
    FiltrationPhaseComponent,
    TelemetryTableComponent,
    MatDialogModule,
    MatIconModule,
    MapaNodosComponent
  ],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public telemetry = inject(TelemetryStateService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.telemetry.iniciar();
  }

  ngOnDestroy() {
    this.telemetry.detener();
  }

  cambiarIntervalo(ms: number) {
    this.telemetry.iniciar(ms);
  }

  guardarIp(evt: { esp: number, ip: string }) {
    this.telemetry.setIp(evt.esp, evt.ip);
  }

  guardarApi(url: string) {
    this.telemetry.setApiUrl(url);
  }

  exportarCSV() {
    // TODO: Implementar exportación CSV
  }

  abrirMapaCamara(nodeId: number) {
    this.dialog.open(CameraDialogComponent, {
      data: { nodeId },
      panelClass: 'glass-dialog',
      width: '800px',
      maxWidth: '95vw',
      height: '600px',
      maxHeight: '90vh',
      backdropClass: 'menu-backdrop'
    });
  }

  abrirEstadisticas(sensor: SensorData): void {
    this.dialog.open(SensorStatsDialogComponent, {
      data: { 
        sensorId: sensor.id, 
        logsSignal: this.telemetry.logsRecientes, 
        sensorSignal: this.telemetry.sensores, 
        aiSignal: this.telemetry.aiDiagnostic 
      },
      panelClass: 'glass-dialog',
      width: '1200px',
      maxWidth: '98vw',
      height: '750px',
      maxHeight: '95vh',
      backdropClass: 'menu-backdrop'
    });
  }
}
