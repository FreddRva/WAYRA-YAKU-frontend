import { Component, Input, Output, EventEmitter, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/servicios/auth.service';

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
        class="absolute right-0 top-14 w-[290px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-3 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200"
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

        <!-- Usuario Activo -->
        <div *ngIf="authService.currentUser() as user" class="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <lucide-icon name="user" class="w-4 h-4"></lucide-icon>
            </div>
            <div class="flex flex-col">
              <span class="text-[12px] font-bold text-white capitalize leading-tight">{{ user.username }}</span>
              <span class="text-[10px] font-mono text-blue-400 uppercase tracking-wider">{{ user.role }}</span>
            </div>
          </div>
          <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">ACTIVO</span>
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

        <!-- Exportar PDF -->
        <div class="flex flex-col mb-2">
          <button (click)="ejecutarExportarPDF()" class="w-full h-10 bg-white/5 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors shadow-sm border border-white/10 cursor-pointer outline-none">
            <lucide-icon name="file-text" class="w-4 h-4 text-white/70"></lucide-icon>
            <span class="text-[13px] font-bold tracking-wide">Exportar PDF (IA)</span>
          </button>
        </div>

        <!-- Exportar CSV -->
        <div class="flex flex-col mb-2">
          <button (click)="ejecutarExportarCSV()" class="w-full h-10 bg-white/5 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors shadow-sm border border-white/10 cursor-pointer outline-none">
            <lucide-icon name="download-cloud" class="w-4 h-4 text-white/70"></lucide-icon>
            <span class="text-[13px] font-bold tracking-wide">Exportar CSV</span>
          </button>
        </div>

        <div class="h-px w-full bg-white/10 my-2"></div>

        <!-- Cerrar Sesión -->
        <div class="flex flex-col">
          <button (click)="cerrarSesion()" class="w-full h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer outline-none">
            <lucide-icon name="log-out" class="w-4 h-4 text-red-400"></lucide-icon>
            <span class="text-[13px] font-bold tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsMenuComponent {
  @Input() conectado: boolean = false;
  @Output() exportar = new EventEmitter<void>();
  @Output() exportarPDF = new EventEmitter<void>();

  readonly authService = inject(AuthService);
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

  ejecutarExportarCSV() {
    this.exportar.emit();
    this.menuOpen = false;
  }

  ejecutarExportarPDF() {
    this.exportarPDF.emit();
    this.menuOpen = false;
  }

  cerrarSesion() {
    this.menuOpen = false;
    this.authService.logout();
  }
}
