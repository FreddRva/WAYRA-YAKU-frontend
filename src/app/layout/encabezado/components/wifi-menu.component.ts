import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wifi-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative">
      <button 
        (click)="toggleMenu($event)"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-transparent hover:bg-white/5 transition-colors border-none cursor-pointer outline-none"
      >
        <lucide-icon name="wifi" class="w-[26px] h-[26px]" 
          [ngClass]="activeCount === 3 ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : (activeCount > 0 ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]')" 
          title="Configuración de Nodos ESP32">
        </lucide-icon>
      </button>

      <div *ngIf="menuOpen"
        class="absolute right-0 top-12 w-[300px] bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 p-3 flex flex-col origin-top-right animate-in fade-in zoom-in-95 duration-200"
        (click)="evitarCierre($event)"
      >
        <!-- Encabezado -->
        <div class="flex items-center gap-3 mb-3 p-1">
          <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shadow-sm relative overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-indigo-500 blur-md"></div>
            <lucide-icon name="router" class="w-5 h-5 text-indigo-400 relative z-10"></lucide-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-[15px] font-extrabold leading-tight text-white tracking-tight">Nodos ESP32</span>
            <span class="text-[11px] font-medium text-white/50 leading-tight">Configurar red Wi-Fi</span>
          </div>
        </div>

        <div class="h-px w-full bg-white/10 mb-3"></div>

        <!-- Campos de IP -->
        <div class="flex flex-col gap-2.5">
          <div class="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-2.5 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">API GLOBAL (Túnel)</span>
            </div>
            <div class="flex items-center gap-2 w-full">
              <input #apiInput type="text" [value]="apiUrl" (keydown.enter)="guardarApi(apiInput.value)"
                     class="flex-1 min-w-0 bg-[#0a0a0a] border border-indigo-500/50 rounded-lg px-2.5 py-1.5 font-mono text-[13px] font-semibold text-white/90 outline-none focus:border-indigo-400 transition-all"
                     placeholder="https://...loca.lt">
              <button (click)="guardarApi(apiInput.value)" class="shrink-0 bg-indigo-500 text-white rounded-lg w-[34px] h-[34px] flex items-center justify-center hover:bg-indigo-400 transition-colors cursor-pointer outline-none border-none">
                <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
          <div *ngFor="let node of [{n:1, ip: ipEsp1, lbl: 'Fase 1'}, {n:2, ip: ipEsp2, lbl: 'Fase 2'}, {n:3, ip: ipEsp3, lbl: 'Fase 3'}]"
               class="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-white/50 uppercase tracking-wider">{{ node.lbl }}</span>
              <span *ngIf="isFaseActiva(node.n)" class="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">Activo</span>
            </div>
            <div class="flex items-center gap-2 w-full">
              <input #ipInput type="text" [value]="node.ip" (keydown.enter)="guardar(node.n, $event)"
                     class="flex-1 min-w-0 bg-[#0a0a0a] border border-white/20 rounded-lg px-2.5 py-1.5 font-mono text-[13px] font-semibold text-white/90 outline-none focus:border-indigo-500 focus:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all"
                     placeholder="192.168.x.x">
              <button (click)="guardarBtn(node.n, ipInput.value)" class="shrink-0 bg-indigo-500 text-white rounded-lg w-[34px] h-[34px] flex items-center justify-center hover:bg-indigo-400 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.4)] cursor-pointer outline-none border-none">
                <lucide-icon name="save" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WifiMenuComponent {
  @Input() conectado: boolean = false;
  @Input() ipEsp1: string = '';
  @Input() ipEsp2: string = '';
  @Input() ipEsp3: string = '';
  @Input() fase1Activa: boolean = false;
  @Input() fase2Activa: boolean = false;
  @Input() fase3Activa: boolean = false;
  @Input() apiUrl: string = '';
  @Output() ipSubmit = new EventEmitter<{ esp: number, ip: string }>();
  @Output() apiSubmit = new EventEmitter<string>();

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

  get activeCount(): number {
    let c = 0;
    if (this.fase1Activa) c++;
    if (this.fase2Activa) c++;
    if (this.fase3Activa) c++;
    return c;
  }

  isFaseActiva(n: number): boolean {
    if (n === 1) return this.fase1Activa;
    if (n === 2) return this.fase2Activa;
    if (n === 3) return this.fase3Activa;
    return false;
  }

  evitarCierre(event: Event) {
    event.stopPropagation();
  }

  guardar(esp: number, evt: Event) {
    const el = evt.target as HTMLInputElement;
    if (el && el.value) {
      this.ipSubmit.emit({ esp, ip: el.value });
      this.mostrarAlerta(esp, el.value);
    }
  }

  guardarBtn(esp: number, fallbackIp: string) {
    this.ipSubmit.emit({ esp, ip: fallbackIp });
    this.mostrarAlerta(esp, fallbackIp);
  }

  guardarApi(url: string) {
    if (url) {
      this.apiSubmit.emit(url);
      Swal.fire({
        title: '¡API Guardada!',
        text: `La URL ${url} se ha configurado correctamente.`,
        icon: 'success',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#0a0a0a',
        color: '#f8fafc',
        iconColor: '#10b981'
      });
    }
  }

  private mostrarAlerta(esp: number, ip: string) {
    Swal.fire({
      title: '¡IP Guardada!',
      text: `La dirección IP ${ip} para la Fase ${esp} se ha configurado correctamente.`,
      icon: 'success',
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#0a0a0a',
      color: '#f8fafc',
      iconColor: '#10b981'
    });
  }
}
