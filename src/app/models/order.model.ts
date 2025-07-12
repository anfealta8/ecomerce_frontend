import { ProductoResponse } from './product.model'; 
import { User } from './user.model';     

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  ENVIADA = 'ENVIADA',
  ENTREGADA = 'ENTREGADA'
}

export interface OrderDetailRequest {
  productoId: number;
  cantidad: number;
}

export interface OrderDetailResponse {
  id?: number; 
  productoId: number;
  nombreProducto: string; 
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface OrderRequest {
  usuarioId: number;
  detalles: OrderDetailRequest[];
  aplicarDescuentoAleatorio?: boolean;
}

export interface OrderResponse {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  fechaCreacion: string; 
  fechaActualizacion: string; 
  estado: OrderStatus; 
  subtotal: number;
  descuentoTotal: number;
  total: number;
  detalles: OrderDetailResponse[];
}

export interface Order {
   id: number;
   usuario: User;
   fechaCreacion: string;
   fechaActualizacion: string;
   estado: OrderStatus;
   subtotal: number;
   descuentoTotal: number;
   total: number;
   detalles: OrderDetail[]; 
 }

export interface OrderDetail {
   id: number;
   ordenId: number; 
   producto: ProductoResponse; 
   cantidad: number;
   precioUnitario: number;
   subtotal: number;
 }
