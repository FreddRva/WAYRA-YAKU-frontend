import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TelemetriaLog } from '../../modelos/telemetria.model';
import { SensorData } from '../../../sensores/modelos/sensor.model';
import { AuthService } from '../../../../core/servicios/auth.service';

@Component({
  selector: 'app-telemetry-table',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, MatIconModule],
  templateUrl: './telemetry-table.component.html',
  styleUrl: './telemetry-table.component.css',
})
export class TelemetryTableComponent implements OnInit {
  readonly auth = inject(AuthService);

  @Input({ required: true }) logs: TelemetriaLog[] = [];
  @Input({ required: true }) totalMuestras = 0;
  @Input() sensores: SensorData[] = [];

  activeTab: 'logs' | 'inventario' = 'inventario';

  ngOnInit() {
    if (this.auth.isMantenimiento()) {
      this.activeTab = 'inventario';
    } else if (!this.auth.canViewMaintenance()) {
      this.activeTab = 'logs';
    }
  }
}
