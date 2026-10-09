import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Componente de visualización de cámara en tiempo real con Angular Material.
 * Admite streams MJPEG, recarga de señal, simulación de snapshot y modo pantalla completa.
 */
@Component({
  selector: 'app-camera-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './camera-feed.component.html'
})
export class CameraFeedComponent {
  @Input() streamUrl: string = '';
  @Input() titulo: string = 'Cámara en Vivo';

  readonly enVivo = signal<boolean>(true);
  readonly editandoUrl = signal<boolean>(false);
  readonly streamActual = signal<string>('');

  ngOnInit(): void {
    this.streamActual.set(this.streamUrl);
  }

  ngOnChanges(): void {
    this.streamActual.set(this.streamUrl);
  }

  recargarStream(): void {
    const urlActual = this.streamActual();
    this.streamActual.set('');
    setTimeout(() => {
      this.streamActual.set(urlActual);
    }, 200);
  }

  toggleEdicionUrl(): void {
    this.editandoUrl.update((v) => !v);
  }

  guardarUrl(nuevaUrl: string): void {
    this.streamActual.set(nuevaUrl.trim());
    this.editandoUrl.set(false);
  }
}
