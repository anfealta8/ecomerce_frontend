import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; // Asegúrate de que esta ruta sea correcta
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode

// Asegúrate de que estas interfaces existan y sus rutas sean correctas
// Si no las tienes, puedes usar 'any' temporalmente o definirlas.
// import { LoginRequest, AuthResponse, UsuarioRequest, UsuarioResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`; // Usa la URL de entorno

  constructor(private http: HttpClient) { }

  /**
   * Llama a la API de registro de usuarios.
   * @param request Los datos del nuevo usuario.
   * @returns Un Observable con la respuesta del usuario registrado.
   */
  register(request: any): Observable<any> { // Usar 'any' si no tienes UsuarioRequest/Response
    return this.http.post<any>(`${this.authUrl}/register`, request);
  }

  /**
   * Llama a la API de login de usuarios.
   * Guarda el token JWT en localStorage al recibirlo.
   * @param credentials Las credenciales del usuario.
   * @returns Un Observable con la respuesta de autenticación (JWT).
   */
  login(credentials: any): Observable<any> { // Usar 'any' si no tienes LoginRequest/AuthResponse
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log('AuthService: Token guardado en localStorage:', response.token.substring(0, 30) + '...');
        } else {
          console.log('AuthService: No se recibió token en la respuesta de login.');
        }
      })
    );
  }

  /**
   * Obtiene el token JWT del localStorage.
   * @returns El token JWT o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Elimina el token JWT del localStorage y realiza el logout.
   */
  logout(): void {
    localStorage.removeItem('token');
    console.log('Sesión cerrada y token eliminado.');
  }

  /**
   * Verifica si el usuario está autenticado y si el token no ha expirado.
   * @returns true si el token es válido y no ha expirado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tiempo actual en segundos
      return decodedToken.exp > currentTime; // Comprueba si el token no ha expirado
    } catch (error) {
      console.error('Error decodificando token o token inválido:', error);
      return false;
    }
  }

  /**
   * Obtiene los roles del usuario desde el token JWT decodificado.
   * @returns Un array de strings con los roles del usuario.
   */
  getRoles(): string[] {
    const token = this.getToken();
    if (!token) {
      return [];
    }
    try {
      const decodedToken: any = jwtDecode(token);
      // Asume que los roles están en un campo 'roles' en el payload del token
      // y que es un array de strings.
      return decodedToken.roles || [];
    } catch (error) {
      console.error('Error decodificando token para obtener roles:', error);
      return [];
    }
  }

  /**
   * Verifica si el usuario autenticado tiene el rol 'ADMIN'.
   * @returns true si el usuario tiene el rol 'ROLE_ADMIN', false en caso contrario.
   */
  isAdmin(): boolean {
    const roles = this.getRoles();
    // Asegúrate de que el rol coincida con el formato de tu backend (ej. "ROLE_ADMIN")
    return roles.includes('ROLE_ADMIN');
  }
}
