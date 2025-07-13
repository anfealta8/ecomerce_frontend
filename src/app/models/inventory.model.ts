export interface InventoryRequest {
  productoId: number;
  cantidadDisponible: number;
  cantidadReservada: number;
  cantidadMinima: number;
}

export interface InventoryResponse {
  id: number;
  productoId: number;
  nombreProducto: string; // Nombre del producto asociado
  skuProducto: string;    // SKU del producto asociado
  cantidadDisponible: number;
  cantidadReservada: number;
  cantidadMinima: number;
  fechaCreacion: string; // LocalDateTime en backend, string en TS
  fechaActualizacion: string; // LocalDateTime en backend, string en TS
}
