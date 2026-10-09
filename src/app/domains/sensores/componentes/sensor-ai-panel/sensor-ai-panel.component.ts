import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sensor-ai-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  styleUrl: './sensor-ai-panel.component.css',
  template: `
    <div class="ai-compact-panel">
      <!-- HEADER -->
      <div class="ai-header" [class.alert]="aiData?.is_anomaly">
        <div class="ai-title-row">
          <mat-icon class="ai-icon">{{ aiData?.is_anomaly ? 'warning' : 'memory' }}</mat-icon>
          <div>
            <h3 class="m-0 text-sm font-bold text-white tracking-wide uppercase">IA Diagnostics</h3>
            <p class="m-0 text-[10px] uppercase font-bold tracking-wider" [class.text-red-400]="aiData?.is_anomaly" [class.text-emerald-400]="!aiData?.is_anomaly">
              {{ aiData?.is_anomaly ? 'Anomalía Detectada' : 'Sistema Estable' }}
            </p>
          </div>
        </div>
        
        <div class="ai-score flex flex-col items-end">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
          <span class="text-sm font-bold font-mono" [class.text-sky-400]="!aiData?.is_anomaly" [class.text-red-400]="aiData?.is_anomaly">
            {{ (aiData?.anomaly_score | number:'1.2-2') || '0.00' }}
          </span>
        </div>
      </div>

      <!-- BODY -->
      <div class="ai-body">
        @if (aiData) {
          @if (aiData.is_anomaly) {
            <div class="ai-alert-box">
              <div class="sensors-chips">
                <span class="text-xs text-slate-400 mb-1.5 block font-medium">Sensores afectados:</span>
                <div class="flex flex-wrap gap-2">
                  @for (s of aiData.anomalous_sensors; track s) {
                    <span class="sensor-chip">{{ s | uppercase }}</span>
                  }
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-red-500/20">
                <div class="flex gap-2 items-start">
                  <mat-icon class="text-red-400 !w-4 !h-4 !text-[16px] mt-0.5">assignment_late</mat-icon>
                  <p class="text-xs text-red-200 m-0 leading-relaxed font-medium">
                    @if (aiData.anomalous_sensors?.includes('temperatura')) {
                      Pico térmico detectado. Revise el sistema de refrigeración inmediatamente.
                    } @else if (aiData.anomalous_sensors?.includes('aguaAnalogico') || aiData.anomalous_sensors?.includes('caudal')) {
                      Caudal inestable. Verifique válvulas y sensor de nivel de agua.
                    } @else {
                      Variación química brusca. Limpie filtros y calibre sondas.
                    }
                  </p>
                </div>
              </div>
            </div>
          } @else {
            <div class="ai-stable-box">
              <mat-icon class="pulse-icon">monitor_heart</mat-icon>
              <p class="m-0 text-xs text-emerald-400/80 leading-relaxed font-medium">
                El modelo MAD indica que el sistema opera dentro de la volatilidad esperada. Sin desviaciones bruscas.
              </p>
            </div>
          }
        } @else {
          <div class="ai-loading">
            <mat-icon class="animate-spin text-sky-500 !w-5 !h-5 !text-[20px]">sync</mat-icon>
            <span class="text-xs text-slate-400 font-medium">Analizando telemetría...</span>
          </div>
        }
      </div>
    </div>
  `,
})
export class SensorAiPanelComponent {
  @Input() aiData: any;
}
