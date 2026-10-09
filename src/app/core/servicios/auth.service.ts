import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TelemetryStateService } from './telemetry-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly telemetryState = inject(TelemetryStateService);

  readonly currentUser = signal<{username: string, role: string} | null>(null);

  constructor() {
    this.checkToken();
  }

  private checkToken() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const username = localStorage.getItem('username');
      if (token && role && username) {
        this.currentUser.set({ username, role });
      }
    }
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.telemetryState.apiUrl()}/api/auth/login`, { username, password })
      .pipe(
        tap(res => {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('role', res.role);
            localStorage.setItem('username', res.username);
            this.currentUser.set({ username: res.username, role: res.role });
          }
        }),
        catchError(err => throwError(() => new Error(err.error?.detail || 'Error al iniciar sesión')))
      );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
