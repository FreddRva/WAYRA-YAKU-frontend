import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CameraFeedComponent } from '../../../procesos/componentes/camera-feed/camera-feed.component';

@Component({
  selector: 'app-camera-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, CameraFeedComponent],
  template: `
  <div class="bg-[#030303] text-slate-50 flex flex-col w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative">
    <div class="h-14 flex items-center justify-between px-5 border-b border-white/5 bg-white/[0.02]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
          <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">videocam</mat-icon>
        </div>
        <div>
          <h2 class="text-sm font-semibold tracking-wide">Monitor Visual (Nodo {{data.nodeId}})</h2>
          <p class="text-[10px] font-mono text-slate-400">Transmisión en vivo ESP32</p>
        </div>
      </div>
      <button mat-icon-button (click)="cerrar()" class="text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div class="flex-1 p-5 overflow-y-auto">
      <app-camera-feed></app-camera-feed>
    </div>
  </div>
  `
})
export class CameraDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CameraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nodeId: number }
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}
