import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sensor-ai-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="h-full bg-black/40 backdrop-blur-[30px] border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative">
      <!-- Decorator -->
      <div class="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none transition-colors duration-700"
           [ngClass]="aiData?.is_anomaly ? 'bg-red-500/10' : 'bg-sky-500/10'"></div>

      <!-- HEADER -->
      <div class="px-6 pt-6 pb-5 border-b border-white/5 flex items-center justify-between relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <div class="w-1.5 h-1.5 rounded-full" [ngClass]="aiData?.is_anomaly ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]'"></div>
            <span class="text-[9px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">Motor Analítico MAD</span>
          </div>
          <h3 class="m-0 text-[13px] font-sans font-bold text-white/90 tracking-widest uppercase">
            Diagnóstico de Señal
          </h3>
        </div>
        <div class="text-right">
          <span class="block text-[9px] font-mono font-bold tracking-[0.2em] text-white/30 uppercase mb-1">SCORE</span>
          <span class="text-lg font-mono font-bold" [ngClass]="aiData?.is_anomaly ? 'text-red-400' : 'text-white/80'">
            {{ (aiData?.anomaly_score | number:'1.2-2') || '0.00' }}
          </span>
        </div>
      </div>

      <!-- BODY -->
      <div class="p-6 flex-1 relative z-10 flex flex-col">
        @if (aiData) {
          @if (aiData.is_anomaly) {
            <div class="border-l-[3px] border-red-500/80 pl-4 py-1 mb-6">
              <span class="text-[10px] font-bold tracking-widest text-red-400 uppercase block mb-2">Divergencia Crítica</span>
              <p class="text-[11px] text-white/70 m-0 leading-relaxed font-sans">
                @if (aiData.anomalous_sensors?.includes('temperatura')) {
                  Inestabilidad térmica detectada en la firma de datos. Se requiere revisión física.
                } @else if (aiData.anomalous_sensors?.includes('aguaAnalogico') || aiData.anomalous_sensors?.includes('caudal')) {
                  Anomalía volumétrica en el flujo principal. Riesgo de estrés en válvulas.
                } @else {
                  Variación química fuera del umbral estocástico proyectado.
                }
              </p>
            </div>
            
            <div class="mt-auto">
              <span class="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase block mb-3">Vectores Afectados</span>
              <div class="flex flex-col gap-2">
                @for (s of aiData.anomalous_sensors; track s) {
                  <div class="flex items-center justify-between bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
                    <span class="text-[11px] font-mono font-bold text-red-300 uppercase tracking-widest">{{ s }}</span>
                    <span class="text-[10px] font-bold text-red-500 uppercase tracking-wider">ERR</span>
                  </div>
                }
              </div>
            </div>

          } @else {
            <div class="border-l-[3px] border-sky-400/80 pl-4 py-1">
              <span class="text-[10px] font-bold tracking-widest text-sky-400 uppercase block mb-2">Estado Óptimo</span>
              <p class="text-[11px] text-white/60 m-0 leading-relaxed font-sans">
                La firma de la señal opera consistentemente dentro de los márgenes de volatilidad proyectados por el modelo.
              </p>
            </div>
            
            <div class="mt-auto flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="text-[9px] font-mono font-bold tracking-[0.2em] text-white/30 uppercase">Confianza del modelo</span>
                <span class="text-[10px] font-mono font-bold text-sky-400">99.8%</span>
              </div>
              <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-sky-400/50 w-[99.8%]"></div>
              </div>
            </div>
          }
        } @else {
          <div class="flex flex-col items-center justify-center h-full gap-4 opacity-40">
            <div class="w-5 h-5 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
            <span class="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-white/60">Sincronizando...</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class SensorAiPanelComponent {
  @Input() aiData: any;
}
