import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-[#0a0a0a]">
      
      <!-- Fondo Profesional: Escudo con filtro oscuro -->
      <div 
        class="absolute inset-0 z-0 bg-no-repeat bg-center bg-[length:90%] md:bg-[length:60%] opacity-[0.08]" 
        style="background-image: url('/Escudo.png');"
      ></div>
      <div class="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80"></div>
      
      <!-- Luces ambientales sutiles para combinar con la página principal -->
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <!-- Tarjeta Glassmorphism -->
      <div class="relative z-10 w-full max-w-md p-8 rounded-2xl bg-[#171717]/80 border border-[#262626] backdrop-blur-xl shadow-2xl">
        
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <img src="/Escudo.png" alt="Escudo" class="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          </div>
          <h1 class="text-2xl font-semibold text-[#f5f5f5] tracking-tight">Wayra Yaku</h1>
          <div class="flex items-center justify-center gap-2 mt-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse"></span>
            <p class="text-[#a3a3a3] text-xs font-mono uppercase tracking-wider">Acceso Restringido</p>
          </div>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-5">
          
          <!-- Error Message -->
          <div *ngIf="error()" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {{ error() }}
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-medium text-[#a3a3a3] ml-1 uppercase tracking-wider">Usuario</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#a3a3a3]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <input 
                type="text" 
                [(ngModel)]="username" 
                name="username" 
                required
                class="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-[#f5f5f5] placeholder-[#525252] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all text-sm"
                placeholder="Ej: supervisor_01"
              >
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between ml-1">
              <label class="text-xs font-medium text-[#a3a3a3] uppercase tracking-wider">Contraseña</label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#a3a3a3]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                required
                class="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-[#f5f5f5] placeholder-[#525252] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all text-sm"
                placeholder="••••••••"
              >
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full mt-2 py-2.5 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium rounded-xl shadow-lg shadow-[#3b82f6]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            <span *ngIf="!loading()">Iniciar Sesión</span>
            <svg *ngIf="loading()" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </button>
        </form>
        
        <div class="mt-6 pt-6 border-t border-[#262626] text-center">
          <p class="text-[10px] text-[#737373] uppercase tracking-wider">
            Plataforma de Monitoreo Industrial<br>
            Protegida por IA
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  
  loading = signal(false);
  error = signal('');

  onSubmit() {
    if (!this.username || !this.password) {
      this.error.set('Por favor, ingresa tus credenciales.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']); // Redirect to dashboard
      },
      error: (err: any) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
