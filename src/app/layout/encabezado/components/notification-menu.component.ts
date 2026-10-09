import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-notification-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <button 
        (click)="toggleMenu($event)"
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 transition-all outline-none"
        [ngClass]="aiDiagnostic?.is_anomaly ? 'text-red-400 animate-pulse' : 'text-white/70 hover:text-white'"
      >
        <lucide-icon name="bell" class="w-5 h-5"></lucide-icon>
      </button>
      
      <span *ngIf="aiDiagnostic?.is_anomaly"
        class="absolute top-0 right-0 flex items-center justify-center min-w-[14px] h-[14px] bg-red-500 text-white font-mono text-[9px] font-bold rounded-full border border-[#0a0a0a]"
      >
        !
      </span>

      <!-- Dropdown -->
      <div *ngIf="menuOpen"
        class="absolute right-0 top-12 w-[320px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-3 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200"
        (click)="evitarCierre($event)"
      >
        <!-- Encabezado Menú -->
        <div class="flex items-center gap-3 mb-3 p-1">
          <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border shadow-sm relative overflow-hidden"
               [ngClass]="aiDiagnostic?.is_anomaly ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'">
            <div class="absolute inset-0 opacity-20 blur-md" [ngClass]="aiDiagnostic?.is_anomaly ? 'bg-red-500' : 'bg-slate-400'"></div>
            <lucide-icon name="bell" class="w-5 h-5 relative z-10" [ngClass]="aiDiagnostic?.is_anomaly ? 'text-red-400' : 'text-slate-300'"></lucide-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-[15px] font-extrabold leading-tight text-white tracking-tight">Notificaciones</span>
            <span class="text-[11px] font-medium text-white/50 leading-tight">Centro de Alertas AI</span>
          </div>
        </div>

        <div class="h-px w-full bg-white/10 mb-3"></div>

        <!-- Alertas Content -->
        <div class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          <!-- Si hay anomalia -->
          <div *ngIf="aiDiagnostic?.is_anomaly" class="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <lucide-icon name="zap" class="w-5 h-5 text-red-400 shrink-0 mt-0.5"></lucide-icon>
            <div class="flex flex-col">
              <span class="text-[13px] font-bold text-red-400">Anomalía Detectada</span>
              <span class="text-[11px] text-red-400/80 mt-1 leading-tight">
                El sistema de IA ha detectado comportamiento anormal en el fluido o los sensores de calidad.
              </span>
              <div class="flex flex-wrap gap-1 mt-2">
                <span *ngFor="let s of aiDiagnostic?.anomalous_sensors" class="text-[9px] px-1.5 py-0.5 rounded border border-red-500/30 bg-red-500/20 text-red-300 font-mono">
                  {{ s | uppercase }}
                </span>
              </div>
            </div>
          </div>

          <!-- Si no hay anomalia -->
          <div *ngIf="!aiDiagnostic?.is_anomaly" class="p-4 flex flex-col items-center justify-center text-center opacity-60">
            <lucide-icon name="check" class="w-8 h-8 text-emerald-400 mb-2"></lucide-icon>
            <span class="text-[12px] font-bold text-white">Todo en orden</span>
            <span class="text-[10px] text-white/60">El motor de IA no reporta anomalías.</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NotificationMenuComponent {
  @Input() aiDiagnostic: any = null;
  
  menuOpen = false;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  evitarCierre(event: Event) {
    event.stopPropagation();
  }
}
