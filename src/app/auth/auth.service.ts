import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { LoginRequest, AuthResponse, UsuarioRequest, UsuarioResponse } from '../models/auth.models'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) { }

  /**
   * Llama a la API de registro de usuarios.
   * @param request Los datos del nuevo usuario.
   * @returns Un Observable con la respuesta del usuario registrado.
   */
  register(request: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.authUrl}/register`, request);
  }

  /**
   * Llama a la API de login de usuarios.
   * Guarda el token JWT en localStorage al recibirlo.
   * @param request Las credenciales del usuario.
   * @returns Un Observable con la respuesta de autenticación (JWT).
   */
 login(credentials: any): Observable<any> { // Usar 'any' temporalmente si no tienes los modelos
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService: Respuesta de login:', response); // <-- AÑADE ESTE LOG
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          console.log('AuthService: Token guardado en localStorage:', response.token.substring(0, 30) + '...'); // Log parcial del token
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
    const token = localStorage.getItem('token');
    console.log('AuthService: getToken() llamado. Token obtenido:', token ? 'Sí' : 'No'); // Log para verificar si lo recupera
    return token;
  }

  /**
   * Elimina el token JWT del localStorage y realiza el logout.
   */
  logout(): void {
    localStorage.removeItem('token');
    console.log('Sesión cerrada y token eliminado.');
    
  }

  /**
   * Verifica si el usuario está autenticado (si hay un token presente).
   * ¡NOTA!: Esto es una comprobación básica, no verifica la validez del token en el servidor.
   * @returns true si hay un token, false en caso contrario.
   */
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }
}