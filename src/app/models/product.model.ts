/**
 * Interfaz para la respuesta de un Producto del backend.
 * Debe coincidir exactamente con tu ProductoResponse DTO en Spring Boot.
 */
export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  sku: string; 
  precio: number; 
  activo: boolean;
  fechaCreacion: string; 
  fechaActualizacion: string; 
}

/**
 * Interfaz para la creación o actualización de un Producto (request al backend).
 * Debe coincidir exactamente con tu ProductoRequest DTO en Spring Boot.
 */
export interface ProductoRequest {
  nombre: string;
  descripcion: string;
  categoria: string;
  sku: string; 
  precio: number; 
  activo: boolean;
  
}