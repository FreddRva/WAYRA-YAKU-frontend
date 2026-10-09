import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sensor-kpis',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  styleUrl: './sensor-kpis.component.css',
  template: `
    <div class="grid grid-cols-4 gap-4">
      
      <!-- ACTUAL -->
      <div class="relative bg-black/40 backdrop-blur-[20px] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 overflow-hidden group shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:bg-black/50 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style="background-color: var(--card-accent)"></div>
        <div class="absolute top-0 left-0 w-1 h-full opacity-80" style="background-color: var(--card-accent);"></div>
        <span class="font-sans text-[10px] font-bold text-white/60 uppercase tracking-widest pl-2">Actual</span>
        <div class="flex items-baseline gap-1 pl-2">
          <span class="font-mono text-3xl font-black tracking-tighter" style="color: var(--card-accent); text-shadow: 0 0 8px rgba(255,255,255,0.1)">{{ valor | number:'1.1-2' }}</span>
          <span class="font-sans text-[10px] font-bold text-white/40">{{ unidad }}</span>
        </div>
      </div>

      <!-- MÁXIMO -->
      <div class="relative bg-black/40 backdrop-blur-[20px] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 overflow-hidden group shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:bg-black/50 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style="background-color: var(--card-accent)"></div>
        <div class="absolute top-0 left-0 w-1 h-full opacity-30" style="background-color: var(--card-accent);"></div>
        <span class="font-sans text-[10px] font-bold text-white/60 uppercase tracking-widest pl-2">Máximo</span>
        <div class="flex items-baseline gap-1 pl-2">
          <span class="font-mono text-2xl font-bold" style="color: var(--card-accent); opacity: 0.9;">{{ max | number:'1.1-2' }}</span>
          <span class="font-sans text-[10px] font-bold text-white/40">{{ unidad }}</span>
        </div>
      </div>

      <!-- MÍNIMO -->
      <div class="relative bg-black/40 backdrop-blur-[20px] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 overflow-hidden group shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:bg-black/50 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style="background-color: var(--card-accent)"></div>
        <div class="absolute top-0 left-0 w-1 h-full opacity-30" style="background-color: var(--card-accent);"></div>
        <span class="font-sans text-[10px] font-bold text-white/60 uppercase tracking-widest pl-2">Mínimo</span>
        <div class="flex items-baseline gap-1 pl-2">
          <span class="font-mono text-2xl font-bold" style="color: var(--card-accent); opacity: 0.9;">{{ min | number:'1.1-2' }}</span>
          <span class="font-sans text-[10px] font-bold text-white/40">{{ unidad }}</span>
        </div>
      </div>

      <!-- PROMEDIO -->
      <div class="relative bg-black/40 backdrop-blur-[20px] border border-white/5 rounded-2xl p-4 flex flex-col gap-1 overflow-hidden group shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all hover:bg-black/50 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style="background-color: var(--card-accent)"></div>
        <div class="absolute top-0 left-0 w-1 h-full opacity-30" style="background-color: var(--card-accent);"></div>
        <span class="font-sans text-[10px] font-bold text-white/60 uppercase tracking-widest pl-2">Promedio (1H)</span>
        <div class="flex items-baseline gap-1 pl-2">
          <span class="font-mono text-2xl font-bold" style="color: var(--card-accent); opacity: 0.9;">{{ avg | number:'1.1-2' }}</span>
          <span class="font-sans text-[10px] font-bold text-white/40">{{ unidad }}</span>
        </div>
      </div>

    </div>
  `
})
export class SensorKpisComponent {
  @Input({ required: true }) valor!: number;
  @Input({ required: true }) unidad!: string;
  @Input({ required: true }) max!: number;
  @Input({ required: true }) min!: number;
  @Input({ required: true }) avg!: number;
}
