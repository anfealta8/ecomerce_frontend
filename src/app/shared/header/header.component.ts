import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,         
    RouterLinkActive,
    CommonModule   
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(public authService: AuthService, private router: Router) { } 

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
  
}