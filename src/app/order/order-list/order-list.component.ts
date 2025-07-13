import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderResponse, OrderStatus } from '../../models/order.model';
import { AuthService } from '../../auth/auth.service'; // Para verificar roles

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Para el modal de confirmación de eliminación
  showConfirmModal: boolean = false;
  orderToDeleteId: number | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar órdenes: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar órdenes:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  viewOrderDetails(id: number): void {
    this.router.navigate(['/orders/details', id]);
  }

  // Lógica para el modal de eliminación
  initiateDelete(orderId: number): void {
    this.orderToDeleteId = orderId;
    this.showConfirmModal = true;
  }

  confirmDeleteOrder(): void {
    if (this.orderToDeleteId !== null) {
      this.orderService.deleteOrder(this.orderToDeleteId).subscribe({
        next: () => {
          this.successMessage = `Orden ${this.orderToDeleteId} eliminada con éxito.`;
          this.loadOrders();
          this.cancelDelete();
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar orden: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al eliminar orden:', err);
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.orderToDeleteId = null;
  }
}
