import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SENSOR_REPOSITORY_TOKEN } from './core/interfaces/sensor.repository.interface';
import { SensorRepositoryImpl } from './infrastructure/repositorios/sensor.repository.impl';
import { MOTOR_REPOSITORY_TOKEN } from './core/interfaces/motor.repository.interface';
import { MotorRepositoryImpl } from './infrastructure/repositorios/motor.repository.impl';
import { LucideAngularModule, Wifi, Router, Save, Check, Cloud, Bell, Settings, History, Zap, Gauge, Timer, RefreshCw, Power, DownloadCloud, Play, Pause, ZoomIn, ZoomOut, RotateCcw, Camera, FileText } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: SENSOR_REPOSITORY_TOKEN, useClass: SensorRepositoryImpl },
    { provide: MOTOR_REPOSITORY_TOKEN, useClass: MotorRepositoryImpl },
    importProvidersFrom(LucideAngularModule.pick({ Wifi, Router, Save, Check, Cloud, Bell, Settings, History, Zap, Gauge, Timer, RefreshCw, Power, DownloadCloud, Play, Pause, ZoomIn, ZoomOut, RotateCcw, Camera, FileText }))
  ]
};
