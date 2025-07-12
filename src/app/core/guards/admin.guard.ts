    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
    import { Observable } from 'rxjs';
    import { AuthService } from '../../auth/auth.service'; // Asegúrate de la ruta correcta

    @Injectable({
      providedIn: 'root'
    })
    export class AdminGuard implements CanActivate {
      constructor(private authService: AuthService, private router: Router) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isAdmin()) { // Necesitas implementar isAdmin() en AuthService
          return true;
        } else {
          // Redirige a una página de acceso denegado o al home
          // Puedes mostrar un mensaje de error antes de redirigir
          alert('Acceso denegado. Se requiere rol de Administrador.'); // Usar un modal en producción
          return this.router.createUrlTree(['/home']);
        }
      }
    }
    