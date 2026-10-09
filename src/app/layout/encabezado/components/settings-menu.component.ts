import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <button 
        (click)="toggleMenu($event)"
        aria-label="Menú de configuración" 
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer outline-none"
      >
        <lucide-icon name="settings" class="w-5 h-5"></lucide-icon>
      </button>

      <div *ngIf="menuOpen"
        class="absolute right-0 top-14 w-[280px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-3 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200"
        (click)="evitarCierre($event)"
      >
        <!-- Encabezado Menú -->
        <div class="flex items-center gap-3 mb-3 p-1">
          <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-sm relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-slate-400 blur-md"></div>
            <lucide-icon name="settings" class="w-5 h-5 text-slate-300 relative z-10"></lucide-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-[15px] font-extrabold leading-tight text-white tracking-tight">Ajustes</span>
            <span class="text-[11px] font-medium text-white/50 leading-tight">Gestión del sistema</span>
          </div>
        </div>

        <div class="h-px w-full bg-white/10 mb-3"></div>

        <!-- Estado Conexión General -->
        <div class="flex flex-col gap-2 mb-2">
          <div class="flex items-center justify-between p-3 rounded-xl transition-all" [ngClass]="conectado ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden" [ngClass]="conectado ? 'bg-emerald-500/20' : 'bg-red-500/20'">
                <div class="absolute inset-0 opacity-20 blur-md" [ngClass]="conectado ? 'bg-emerald-500' : 'bg-red-500'"></div>
                 <lucide-icon name="power" class="w-5 h-5 relative z-10" [ngClass]="conectado ? 'text-emerald-400' : 'text-red-400'"></lucide-icon>
              </div>
              <div class="flex flex-col">
                <span class="text-[14px] font-extrabold leading-tight" [ngClass]="conectado ? 'text-emerald-400' : 'text-red-400'">{{ conectado ? 'En Línea' : 'Desconectado' }}</span>
                <span class="text-[10px] font-bold text-white/40 uppercase leading-tight">Estado de red</span>
              </div>
            </div>
          </div>
        </div>

        <div class="h-px w-full bg-white/10 mb-3"></div>

        <!-- Exportar CSV -->
        <div class="flex flex-col">
          <button (click)="ejecutarExportar()" class="w-full h-11 bg-white/5 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors shadow-sm border border-white/10 cursor-pointer outline-none">
            <lucide-icon name="download-cloud" class="w-5 h-5 text-white/70"></lucide-icon>
            <span class="text-[14px] font-bold tracking-wide">Exportar Datos</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsMenuComponent {
  @Input() conectado: boolean = false;
  @Output() exportar = new EventEmitter<void>();

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

  ejecutarExportar() {
    this.exportar.emit();
    this.menuOpen = false;
  }
}
