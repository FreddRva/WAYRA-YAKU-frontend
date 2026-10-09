import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SettingsMenuComponent } from './components/settings-menu.component';
import { SamplingMenuComponent } from './components/sampling-menu.component';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, SettingsMenuComponent, SamplingMenuComponent],
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {
  @Input() conectado: boolean = false;
  @Input() ultimaActualizacion: Date = new Date();
  @Input() ipEsp1: string = '';
  @Input() ipEsp2: string = '';
  @Input() ipEsp3: string = '';
  @Input() intervaloMs: number = 500;
  
  @Input() fase1Activa: boolean = false;
  @Input() fase2Activa: boolean = false;
  @Input() fase3Activa: boolean = false;

  @Output() intervaloCambiado = new EventEmitter<number>();
  @Output() ipGuardada = new EventEmitter<{ esp: number, ip: string }>();
  @Output() exportar = new EventEmitter<void>();
  @Output() ipSubmit = new EventEmitter<{ esp: number, ip: string }>();
  @Output() apiSubmit = new EventEmitter<string>();
  @Output() intervaloChange = new EventEmitter<number>();
  @Input() apiUrl: string = '';
}
