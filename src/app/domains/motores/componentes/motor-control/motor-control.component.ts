import { Component, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { DireccionMotor } from '../../modelos/motor.model';

/**
 * Componente de control direccional del motor con D-Pad de Angular Material.
 * Admite clics directos y atajos de teclado (Flechas direccionales, WASD y Espacio para Stop).
 */
@Component({
  selector: 'app-motor-control',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatRippleModule,
    MatChipsModule,
  ],
  templateUrl: './motor-control.component.html'
})
export class MotorControlComponent {
  /** Emite la dirección elegida */
  @Output() movimiento = new EventEmitter<DireccionMotor>();

  /** Última dirección ejecutada para dar feedback visual */
  readonly ultimaDireccion = signal<DireccionMotor | null>(null);
  readonly comandoActivo = signal<DireccionMotor | null>(null);

  /**
   * Listener global de teclado para controlar con Flechas / WASD
   */
  @HostListener('window:keydown', ['$event'])
  manejarTeclado(event: KeyboardEvent): void {
    // Ignorar si el usuario está escribiendo en un input
    const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    let dir: DireccionMotor | null = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        dir = 'arriba';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        dir = 'abajo';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        dir = 'izquierda';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        dir = 'derecha';
        break;
      case ' ':
      case 'Escape':
        dir = 'stop';
        break;
    }

    if (dir) {
      event.preventDefault();
      this.mover(dir);
    }
  }

  mover(direccion: DireccionMotor): void {
    this.comandoActivo.set(direccion);
    this.ultimaDireccion.set(direccion);
    this.movimiento.emit(direccion);

    // Resetear el efecto visual de presión después de 300ms
    setTimeout(() => {
      if (this.comandoActivo() === direccion) {
        this.comandoActivo.set(null);
      }
    }, 300);
  }
}
