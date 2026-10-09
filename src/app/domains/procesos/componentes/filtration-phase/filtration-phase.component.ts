import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SensorData } from '../../../sensores/modelos/sensor.model';
import { SensorCardComponent } from '../../../sensores/componentes/sensor-card/sensor-card.component';

@Component({
  selector: 'app-filtration-phase',
  standalone: true,
  imports: [CommonModule, MatIconModule, SensorCardComponent],
  template: `
    <div class="eng-panel flex flex-col h-full gap-4 group h-full">
      <div class="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div class="flex items-center gap-3">
          <div class="h-5 w-1 rounded-full" 
               [ngClass]="{
                 'bg-[#3b82f6]': phaseNumber === 1,
                 'bg-[#22c55e]': phaseNumber === 2,
                 'bg-[#a855f7]': phaseNumber === 3
               }"></div>
          <h3 class="text-[15px] font-semibold text-[#f5f5f5] tracking-tight m-0">{{ title }}</h3>
        </div>
        <div class="flex items-center gap-2 text-xs font-medium"
             [ngClass]="(conectado && sensores.length > 0) ? 'text-[#f5f5f5]' : 'text-[#737373]'">
          <span class="w-2 h-2 rounded-full" 
                [ngClass]="(conectado && sensores.length > 0) ? 'bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#525252]'"></span>
          {{ (conectado && sensores.length > 0) ? 'Activo' : 'En Espera' }}
        </div>
      </div>

      <div class="flex flex-col gap-3 z-10 flex-1">
        @for (s of sensores; track s.id) {
          <app-sensor-card [sensor]="s" (sensorClick)="onAbrirEstadisticas.emit($event)"></app-sensor-card>
        } @empty {
          <div class="flex flex-col items-center justify-center h-[120px] border border-dashed border-[#404040] bg-[#0a0a0a] text-center p-4">
            <mat-icon class="text-[#525252] mb-2">blur_off</mat-icon>
            <span class="text-xs font-medium text-[#737373] uppercase tracking-wider">Sin Sensores Vinculados</span>
          </div>
        }
      </div>
    </div>
  `
})
export class FiltrationPhaseComponent {
  @Input() title!: string;
  @Input() phaseNumber!: number;
  @Input() conectado!: boolean;
  @Input() sensores!: SensorData[];
  
  @Output() onAbrirEstadisticas = new EventEmitter<SensorData>();
}
