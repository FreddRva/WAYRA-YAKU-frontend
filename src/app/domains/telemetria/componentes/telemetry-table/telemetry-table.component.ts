import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TelemetriaLog } from '../../modelos/telemetria.model';

@Component({
  selector: 'app-telemetry-table',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe, MatIconModule],
  templateUrl: './telemetry-table.component.html',
  styleUrl: './telemetry-table.component.css',
})
export class TelemetryTableComponent {
  @Input({ required: true }) logs: TelemetriaLog[] = [];
  @Input({ required: true }) totalMuestras = 0;
}
