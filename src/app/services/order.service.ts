import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Para la URL base de la API

import { OrderRequest, OrderResponse, OrderStatus } from '../models/order.model'; // Importa los modelos de orden

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/ordenes`; // Coincide con @RequestMapping("/api/ordenes")

  constructor(private http: HttpClient) { }

  /**
   * Crea una nueva orden de compra.
   * Corresponde a POST /api/ordenes
   * @param orderRequest Los datos de la orden a crear.
   * @returns Un Observable con la OrdenResponse de la orden creada.
   */
  createOrder(orderRequest: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderRequest);
  }

  /**
   * Obtiene una orden por su ID.
   * Corresponde a GET /api/ordenes/{id}
   * @param id El ID de la orden.
   * @returns Un Observable con la OrdenResponse.
   */
  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las órdenes.
   * Corresponde a GET /api/ordenes
   * @returns Un Observable con una lista de OrdenResponse.
   */
  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl);
  }

  /**
   * Obtiene las órdenes de un usuario específico.
   * Corresponde a GET /api/ordenes/usuario/{usuarioId}
   * @param userId El ID del usuario.
   * @returns Un Observable con una lista de OrdenResponse del usuario.
   */
  getOrdersByUserId(userId: number): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  /**
   * Actualiza el estado de una orden.
   * Corresponde a PUT /api/ordenes/{id}/estado?nuevoEstado={estado}
   * @param id El ID de la orden.
   * @param newStatus El nuevo estado de la orden (del enum OrderStatus).
   * @returns Un Observable con la OrdenResponse actualizada.
   */
  updateOrderStatus(id: number, newStatus: OrderStatus): Observable<OrderResponse> {
    // Usamos HttpParams para enviar el estado como query parameter
    // const params = new HttpParams().set('nuevoEstado', newStatus);
    // return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/estado`, null, { params });
    // O más simple si el backend lo acepta como parte del cuerpo o directamente en la URL
    return this.http.put<OrderResponse>(`${this.apiUrl}/${id}/estado?nuevoEstado=${newStatus}`, {}); // Enviar un cuerpo vacío si no se requiere
  }

  /**
   * Elimina una orden por su ID.
   * Corresponde a DELETE /api/ordenes/{id}
   * @param id El ID de la orden a eliminar.
   * @returns Un Observable vacío (void).
   */
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
