import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Para la URL base de la API

import { InventoryRequest, InventoryResponse } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventarios`; // Coincide con @RequestMapping("/api/inventarios")

  constructor(private http: HttpClient) { }

  /**
   * Crea un nuevo registro de inventario.
   * Corresponde a POST /api/inventarios
   * @param request Los datos del inventario a crear.
   * @returns Un Observable con el InventarioResponse del inventario creado.
   */
  createInventory(request: InventoryRequest): Observable<InventoryResponse> {
    return this.http.post<InventoryResponse>(this.apiUrl, request);
  }

  /**
   * Obtiene un registro de inventario por su ID.
   * Corresponde a GET /api/inventarios/{id}
   * @param id El ID del registro de inventario.
   * @returns Un Observable con el InventarioResponse.
   */
  getInventoryById(id: number): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene un registro de inventario por el ID de su producto asociado.
   * Corresponde a GET /api/inventarios/producto/{productoId}
   * @param productId El ID del producto.
   * @returns Un Observable con el InventarioResponse.
   */
  getInventoryByProductId(productId: number): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${this.apiUrl}/producto/${productId}`);
  }

  /**
   * Obtiene todos los registros de inventario.
   * Corresponde a GET /api/inventarios
   * @returns Un Observable con una lista de InventarioResponse.
   */
  getAllInventories(): Observable<InventoryResponse[]> {
    return this.http.get<InventoryResponse[]>(this.apiUrl);
  }

  /**
   * Actualiza un registro de inventario existente.
   * Corresponde a PUT /api/inventarios/{id}
   * @param id El ID del registro de inventario a actualizar.
   * @param request Los nuevos datos del inventario.
   * @returns Un Observable con el InventarioResponse actualizado.
   */
  updateInventory(id: number, request: InventoryRequest): Observable<InventoryResponse> {
    return this.http.put<InventoryResponse>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Elimina un registro de inventario por su ID.
   * Corresponde a DELETE /api/inventarios/{id}
   * @param id El ID del registro de inventario a eliminar.
   * @returns Un Observable vacío (void).
   */
  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
