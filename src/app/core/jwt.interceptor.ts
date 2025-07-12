// src/app/core/jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service'; // RUTA DEBE SER CORRECTA

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('--- INICIO Interceptor JWT ---');
  console.log('Interceptando URL:', req.url);
  console.log('Método HTTP:', req.method);

  const authService = inject(AuthService); // Obtiene la instancia de AuthService
  const token = authService.getToken(); // Llama al método getToken() del servicio

  console.log('Token obtenido de AuthService dentro del Interceptor:', token ? 'Presente' : 'Ausente');

  // Solo añade el token si existe Y la URL no es de autenticación (login/register)
  if (token && !req.url.includes('/api/auth/login') && !req.url.includes('/api/auth/register')) {
    console.log('Token presente y URL no es de autenticación. Clonando solicitud para añadir Bearer.');
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Solicitud clonada con encabezado Authorization añadido.');
    console.log('--- FIN Interceptor JWT (con token) ---');
    return next(clonedReq); // Pasar la solicitud clonada
  } else {
    console.log('No se añadió encabezado Authorization (token ausente o es URL de autenticación).');
    console.log('--- FIN Interceptor JWT (sin token) ---');
    return next(req); // Pasar la solicitud original
  }
};