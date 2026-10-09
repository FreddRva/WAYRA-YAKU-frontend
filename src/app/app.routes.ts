import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./domains/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/principal/main-layout.component').then(m => m.MainLayoutComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
