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
      <div class="flex items-center justify-between pb-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="h-6 w-1.5 rounded-full" 
               [ngClass]="{
                 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]': phaseNumber === 1,
                 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]': phaseNumber === 2,
                 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]': phaseNumber === 3
               }"></div>
          <h3 class="text-[16px] font-sans font-bold text-white/90 tracking-widest uppercase m-0">{{ title }}</h3>
        </div>
        <div class="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full border"
             [ngClass]="(conectado && sensores.length > 0) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'">
          <span class="w-2 h-2 rounded-full" 
                [ngClass]="(conectado && sensores.length > 0) ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-white/20'"></span>
          {{ (conectado && sensores.length > 0) ? 'Activo' : 'Espera' }}
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
