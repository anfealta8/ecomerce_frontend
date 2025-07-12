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
 login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, request).pipe(
      tap(response => {
        if (response && response.token) {
          //console.log('AuthService: Intentando guardar JWT Token:', response.token); 
          localStorage.setItem('jwt_token', response.token);
          //console.log('AuthService: JWT Token guardado. Verificando en localStorage.getItem():', localStorage.getItem('jwt_token')); 
        } else {
          console.log('AuthService: La respuesta de login no contiene JWT o es nula.', response); 
        }
      })
    );
  }

  /**
   * Obtiene el token JWT del localStorage.
   * @returns El token JWT o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Elimina el token JWT del localStorage y realiza el logout.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
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