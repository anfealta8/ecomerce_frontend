import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model'; 
import { TopFrequentCustomerResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios del backend.
   * Corresponde al GET /api/users
   * @returns Un Observable con un array de objetos User.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Obtiene un usuario específico por su ID.
   * Corresponde al GET /api/users/{id}
   * @param id El ID del usuario.
   * @returns Un Observable con un objeto User.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo usuario.
   * Corresponde al POST /api/users
   * @param user El objeto User con los datos del nuevo usuario.
   * @returns Un Observable con el objeto User creado.
   */
  createUser(user: User): Observable<User> {
    // Asegúrate de que el objeto 'user' enviado aquí coincida con tu UsuarioRequest DTO de Spring Boot.
    // Tu UsuarioRequest tiene username, password, email.
    const requestBody = {
      username: user.username,
      password: user.password,
      email: user.email,
      // Los roles no suelen enviarse en la creación inicial de usuario/registro,
      // sino que se asignan por defecto en el backend o en una operación de edición posterior.
      // Si tu backend espera roles en la creación, descomenta la línea de abajo.
      // roles: user.roles
    };
    return this.http.post<User>(this.apiUrl, requestBody as User);
  }

  /**
   * Actualiza un usuario existente.
   * Corresponde al PUT /api/users/{id}
   * @param id El ID del usuario a actualizar.
   * @param user El objeto User con los datos actualizados.
   * @returns Un Observable con el objeto User actualizado.
   */
  updateUser(id: number, user: User): Observable<User> {
    // Asegúrate de que el objeto 'user' enviado aquí coincida con tu UsuarioRequest DTO de Spring Boot.
    // Tu UsuarioRequest tiene username, password, email.
    const requestBody = {
      username: user.username,
      password: user.password, // Solo si se está actualizando la contraseña
      email: user.email,
      roles: user.roles // Si tu endpoint de actualización acepta roles
    };
    return this.http.put<User>(`${this.apiUrl}/${id}`, requestBody as User);
  }

  /**
   * Elimina un usuario por su ID.
   * Corresponde al DELETE /api/users/{id}
   * @param id El ID del usuario a eliminar.
   * @returns Un Observable vacío (void).
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene el Top 5 de clientes más frecuentes.
   * Corresponde a GET /api/usuarios/reportes/top5-frecuentes
   * @returns Un Observable con una lista de TopFrequentCustomerResponse.
   */
  getTop5FrequentCustomers(): Observable<TopFrequentCustomerResponse[]> {
    return this.http.get<TopFrequentCustomerResponse[]>(`${this.apiUrl}/reportes/top5-frecuentes`);
  }
}
