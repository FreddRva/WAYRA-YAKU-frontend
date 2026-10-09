import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

type BotonTipo = 'primario' | 'secundario' | 'peligro' | 'fantasma';
type BotonTamano = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      [type]="type"
      [disabled]="deshabilitado"
      (click)="onClick($event)"
      class="inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      [ngClass]="getClases()"
    >
      @if (icono) {
        <lucide-icon [name]="icono" [class]="tamano === 'sm' ? 'w-[18px] h-[18px]' : 'w-5 h-5'"></lucide-icon>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class BotonComponent {
  @Input() tipo: BotonTipo = 'primario';
  @Input() tamano: BotonTamano = 'md';
  @Input() icono?: string;
  @Input() deshabilitado: boolean = false;
  @Input() expandir: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  
  @Output() clickBoton = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.deshabilitado) {
      this.clickBoton.emit(event);
    }
  }

  getClases(): string {
    let clases = '';
    
    // Tamaño
    if (this.tamano === 'sm') clases += 'px-3 py-1.5 text-xs rounded-md ';
    else if (this.tamano === 'md') clases += 'px-4 py-2 text-sm rounded-lg ';
    else if (this.tamano === 'lg') clases += 'px-6 py-3 text-base rounded-xl ';

    // Ancho
    if (this.expandir) clases += 'w-full ';

    // Estilo visual (Tipo)
    switch (this.tipo) {
      case 'primario':
        clases += 'bg-sky-500 text-white hover:bg-sky-400 shadow-md shadow-sky-500/20 border border-sky-400/50 ';
        break;
      case 'secundario':
        clases += 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 ';
        break;
      case 'peligro':
        clases += 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 ';
        break;
      case 'fantasma':
        clases += 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 ';
        break;
    }

    return clases.trim();
  }
}
