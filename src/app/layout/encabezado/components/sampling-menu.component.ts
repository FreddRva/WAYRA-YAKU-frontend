import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sampling-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <!-- Botón Disparador -->
      <button 
        (click)="toggleMenu($event)"
        class="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer outline-none"
      >
        <lucide-icon name="zap" class="w-5 h-5" title="Velocidad de Muestreo"></lucide-icon>
      </button>
      
      <!-- Menú Flotante (Custom Dropdown) -->
      <div 
        *ngIf="menuOpen"
        class="absolute right-0 top-12 w-[280px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-3 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200"
        (click)="evitarCierre($event)"
      >
        <!-- Encabezado Menú -->
        <div class="flex items-center gap-3 mb-3 p-1">
          <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-sm relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-cyan-500 blur-md"></div>
            <lucide-icon name="gauge" class="w-5 h-5 text-cyan-400 relative z-10"></lucide-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-[15px] font-extrabold leading-tight text-white tracking-tight">Muestreo</span>
            <span class="text-[11px] font-medium text-white/50 leading-tight">Frecuencia de lectura</span>
          </div>
        </div>

        <div class="h-px w-full bg-white/10 mb-3"></div>

        <!-- Selector Frecuencia -->
        <div class="flex flex-col gap-1.5">
          <button *ngFor="let opt of opciones"
            class="w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all cursor-pointer outline-none group"
            [ngClass]="intervaloMs === opt.ms ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-transparent border-transparent hover:bg-white/5'"
            (click)="cambiarIntervalo(opt.ms)">
            
            <div class="flex items-center gap-3">
              <lucide-icon class="w-5 h-5 transition-colors" [ngClass]="intervaloMs === opt.ms ? 'text-cyan-400' : 'text-white/40 group-hover:text-white/70'" [name]="opt.icon"></lucide-icon>
              <div class="flex flex-col transition-colors">
                <span class="text-[14px] font-extrabold leading-tight" [ngClass]="intervaloMs === opt.ms ? 'text-cyan-50' : 'text-white/80 group-hover:text-white'">{{ opt.lbl }}</span>
                <span class="text-[10px] font-bold font-mono uppercase leading-tight" [ngClass]="intervaloMs === opt.ms ? 'text-cyan-400/80' : 'text-white/40'">{{ opt.sub }}</span>
              </div>
            </div>
            <lucide-icon *ngIf="intervaloMs === opt.ms" name="check" class="w-5 h-5 text-cyan-400"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SamplingMenuComponent {
  @Input() intervaloMs: number = 500;
  @Output() intervaloChange = new EventEmitter<number>();
  
  menuOpen = false;
  
  opciones = [
    { ms: 300, icon: 'zap', lbl: 'Extremo', sub: '300ms' },
    { ms: 500, icon: 'gauge', lbl: 'Fluido', sub: '500ms' },
    { ms: 1000, icon: 'timer', lbl: 'Rápido', sub: '1.0s' },
    { ms: 2000, icon: 'refresh-cw', lbl: 'Estándar', sub: '2.0s' }
  ];

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

  cambiarIntervalo(ms: number) {
    this.intervaloChange.emit(ms);
    this.menuOpen = false;
  }
}
