// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Asegúrate de estas importaciones

import { routes } from './app.routes'; // Asume que tus rutas están aquí
import { jwtInterceptor } from './core/jwt.interceptor'; // Asume que tu interceptor está aquí

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
};