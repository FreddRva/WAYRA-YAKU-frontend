import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';
import { CameraFeedComponent } from '../../../procesos/componentes/camera-feed/camera-feed.component';

@Component({
  selector: 'app-mapa-nodos',
  standalone: true,
  imports: [CommonModule, MatIconModule, CameraFeedComponent],
  template: `
    <div
      class="relative w-full h-full transition-all duration-700 ease-out flex flex-col bg-[#050505] rounded-xl border overflow-hidden shadow-lg"
      [ngClass]="
        vistaActual === 'camara'
          ? 'min-h-[450px] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'min-h-[300px] border-[#262626]'
      "
    >
      <div
        class="absolute inset-0 w-full h-full transition-all duration-700 ease-out"
        [ngClass]="
          vistaActual === 'mapa'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        "
      >
        <div #mapContainer class="absolute inset-0 w-full h-full z-0"></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none z-10"
        ></div>
      </div>

      <div
        *ngIf="vistaActual === 'camara'"
        class="absolute inset-0 w-full h-full bg-[#030303] flex flex-col z-50 animate-camera-reveal"
      >
        <button
          (click)="cerrarCamara()"
          class="absolute top-3 left-3 z-[60] text-slate-300 hover:text-white flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 transition-colors cursor-pointer shadow-lg shadow-black/50"
        >
          <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">arrow_back</mat-icon> Volver al Mapa
        </button>

        <div
          class="absolute bottom-4 left-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/5 pointer-events-none"
        >
          <mat-icon class="text-emerald-500 !text-[16px] !w-[16px] !h-[16px]">videocam</mat-icon>
          <span class="text-xs font-medium text-white/90">Estación UNSCH</span>
        </div>

        <div class="flex-1 w-full h-full relative overflow-hidden bg-black">
          <app-camera-feed
            class="absolute inset-0 w-full h-full animate-camera-lens [&>div]:rounded-none [&>div]:border-none"
          ></app-camera-feed>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .custom-node-marker {
        background: transparent;
        border: none;
      }
      ::ng-deep .leaflet-tile-pane {
        filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%) grayscale(20%);
      }

      @keyframes reveal {
        from {
          opacity: 0;
          backdrop-filter: blur(10px);
        }
        to {
          opacity: 1;
          backdrop-filter: blur(0px);
        }
      }

      @keyframes lensScale {
        from {
          transform: scale(1.1);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .animate-camera-reveal {
        animation: reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      .animate-camera-lens {
        animation: lensScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `,
  ],
})
export class MapaNodosComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  vistaActual: 'mapa' | 'camara' = 'mapa';
  private map: L.Map | undefined;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const lat = -13.161041;
    const lng = -74.224673;

    this.map = L.map(this.mapContainer.nativeElement).setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    const customIcon = L.divIcon({
      className: 'custom-node-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 40px; height: 40px;">
          <!-- Pulse Ring -->
          <div class="absolute w-12 h-12 rounded-full border-2 border-emerald-500 opacity-40 animate-ping"></div>
          
          <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.8)] bg-emerald-500 text-white group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </div>
          
          <div class="absolute top-12 mt-2 bg-[#0a0a0a] border border-emerald-500/50 px-3 py-1.5 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000] shadow-lg pointer-events-none">
            <div class="text-[11px] font-bold text-white">Estación UNSCH</div>
            <div class="text-[9px] text-emerald-400 mt-0.5">Click para ver cámara</div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

    marker.on('click', () => {
      this.zone.run(() => {
        this.abrirCamara();
      });
    });
  }

  abrirCamara() {
    this.vistaActual = 'camara';
  }

  cerrarCamara() {
    this.vistaActual = 'mapa';
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
