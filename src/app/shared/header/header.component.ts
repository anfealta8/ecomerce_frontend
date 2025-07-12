import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Importa RouterLink y RouterLinkActive
import { CommonModule } from '@angular/common'; // Para *ngIf
import { AuthService } from '../../auth/auth.service'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Añade RouterLink y RouterLinkActive
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) { } // Inyecta AuthService públicamente

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
