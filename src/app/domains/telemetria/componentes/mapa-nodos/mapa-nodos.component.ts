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
    // 1. Cabecera de Cuenca Cachi-Apacheta (Estación de Sensores y Filtración a 4,330 msnm)
    const apachetaLat = -13.3500;
    const apachetaLng = -74.6800;

    // 2. Campus UNSCH (Centro de Recepción y Supervisión)
    const unschLat = -13.161041;
    const unschLng = -74.224673;

    this.map = L.map(this.mapContainer.nativeElement).setView([apachetaLat, apachetaLng], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Icono Estación de Telemetría Apacheta
    const apachetaIcon = L.divIcon({
      className: 'custom-node-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
          <div class="absolute w-12 h-12 rounded-full border-2 border-emerald-400 opacity-60 animate-ping"></div>
          <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(16,185,129,0.9)] bg-emerald-500 text-white group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div class="absolute top-12 mt-1 bg-[#0a0a0a]/95 border border-emerald-500/50 px-2.5 py-1 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000] shadow-xl pointer-events-none">
            <div class="text-[11px] font-bold text-white">Cabecera Cachi-Apacheta</div>
            <div class="text-[9px] text-emerald-400 font-mono">4,330 msnm • Telemetría</div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    // Icono UNSCH Base
    const unschIcon = L.divIcon({
      className: 'custom-node-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 40px; height: 40px;">
          <div class="w-9 h-9 rounded-full flex items-center justify-center border-2 border-blue-400/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] bg-blue-600 text-white group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
          </div>
          <div class="absolute top-11 mt-1 bg-[#0a0a0a]/95 border border-blue-500/50 px-2.5 py-1 rounded-lg text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[1000] shadow-xl pointer-events-none">
            <div class="text-[11px] font-bold text-white">Campus UNSCH</div>
            <div class="text-[9px] text-blue-400 font-mono">Centro de Control</div>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const markerApacheta = L.marker([apachetaLat, apachetaLng], { icon: apachetaIcon }).addTo(this.map);
    const markerUnsch = L.marker([unschLat, unschLng], { icon: unschIcon }).addTo(this.map);

    // Enlace de telemetría por satélite (Starlink)
    L.polyline([[apachetaLat, apachetaLng], [unschLat, unschLng]], {
      color: '#10b981',
      weight: 2,
      dashArray: '6, 10',
      opacity: 0.7
    }).addTo(this.map);

    // Ajustar vista para abarcar ambos puntos
    this.map.fitBounds([
      [apachetaLat, apachetaLng],
      [unschLat, unschLng]
    ], { padding: [40, 40] });

    markerApacheta.on('click', () => {
      this.zone.run(() => {
        this.abrirCamara();
      });
    });

    markerUnsch.on('click', () => {
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
