import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../auth.service'; 
import { LoginRequest } from '../../models/auth.models'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = ''; 
    const loginRequest: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = err.error?.message || 'Credenciales inválidas o error de conexión.';
        if (err.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else if (err.status >= 500) {
          this.errorMessage = 'Error del servidor. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}