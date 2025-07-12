import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../auth.service'; 
import { UsuarioRequest } from '../../models/auth.models'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule], 
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) { } 

  onRegister(): void {
    this.errorMessage = ''; 
    this.successMessage = '';
    const registerRequest: UsuarioRequest = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.successMessage = 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.';
        this.username = '';
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = err.error?.message || 'Error al registrar el usuario.';
        if (err.status === 409) { 
          this.errorMessage = 'El nombre de usuario o email ya están en uso.';
        } else if (err.status >= 400 && err.status < 500) {
          this.errorMessage = 'Datos inválidos. Por favor, revisa el formulario.';
        } else if (err.status >= 500) {
          this.errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        }
      }
    });
  }
}