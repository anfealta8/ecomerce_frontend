    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
    import { Observable } from 'rxjs';
    import { AuthService } from '../../auth/auth.service'; // Asegúrate de la ruta correcta

    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuard implements CanActivate {
      constructor(private authService: AuthService, private router: Router) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isLoggedIn()) {
          return true;
        } else {
          // Redirige al usuario a la página de login si no está autenticado
          return this.router.createUrlTree(['/login']);
        }
      }
    }
    