import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { ProductoRequest, ProductoResponse } from '../models/product.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los productos del backend.
   * Corresponde al GET /api/productos
   */
  getProducts(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl);
  }

  /**
   * Obtiene un producto por su ID.
   * Corresponde al GET /api/productos/{id}
   */
  getProductById(id: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto.
   * Corresponde al POST /api/productos
   * Requiere autenticación y rol ADMIN en el backend.
   */
  createProduct(product: ProductoRequest): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(this.apiUrl, product);
  }

  /**
   * Actualiza un producto existente.
   * Corresponde al PUT /api/productos/{id}
   * Requiere autenticación y rol ADMIN en el backend.
   */
  updateProduct(id: number, product: ProductoRequest): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Elimina un producto por su ID.
   * Corresponde al DELETE /api/productos/{id}
   * Requiere autenticación y rol ADMIN en el backend.
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca productos por nombre.
   * Corresponde a GET /api/productos/buscar/nombre?nombre={nombre}
   * @param name El nombre (o parte del nombre) a buscar.
   * @returns Un Observable con una lista de ProductoResponse que coinciden.
   */
  searchProductsByName(name: string): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/buscar/nombre?nombre=${name}`);
  }

  /**
   * Busca productos por categoría.
   * Corresponde a GET /api/productos/buscar/categoria?categoria={categoria}
   * @param category La categoría a buscar.
   * @returns Un Observable con una lista de ProductoResponse que coinciden.
   */
  searchProductsByCategory(category: string): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/buscar/categoria?categoria=${category}`);
  }

  /**
   * Obtiene el Top 5 de productos más vendidos.
   * Corresponde a GET /api/productos/reportes/top5-vendidos
   * @returns Un Observable con una lista de ProductoResponse (asumiendo que el backend devuelve esto).
   */
  getTop5SoldProducts(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/reportes/top5-vendidos`);
  }
  /**
   * Obtiene la lista de productos activos.
   * Corresponde a GET /api/productos/activos
   * @returns Un Observable con una lista de ProductoResponse de productos activos.
   */
  getActiveProducts(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/activos`);
  }
}