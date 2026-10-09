import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-boton-icono',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, MatTooltipModule],
  template: `
    <button 
      type="button" 
      class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 outline-none focus:outline-none"
      [ngClass]="{
        'text-slate-400 hover:text-sky-400 hover:bg-sky-400/10': !active,
        'text-rose-500 bg-rose-500/10': active
      }"
      [matTooltip]="tooltip"
      (click)="onClick($event)">
      <lucide-icon [name]="icon" class="w-5 h-5"></lucide-icon>
    </button>
  `
})
export class BotonIconoComponent {
  @Input({ required: true }) icon!: string;
  @Input() tooltip: string = '';
  @Input() active: boolean = false;
  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    this.buttonClick.emit(event);
  }
}
