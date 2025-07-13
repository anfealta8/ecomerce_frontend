import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderResponse, OrderStatus } from '../../models/order.model';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms'; // Para ngModel en el select

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule // Necesario para ngModel
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: OrderResponse | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  orderId: number | null = null;
  
  availableStatuses: OrderStatus[] = Object.values(OrderStatus); // Obtiene todos los valores del enum
  selectedStatus: OrderStatus | null = null; // Para el ngModel del select

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = +id;
        this.loadOrderDetails(this.orderId);
      } else {
        this.errorMessage = 'ID de orden no proporcionado.';
      }
    });
  }

  loadOrderDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.selectedStatus = data.estado; // Establece el estado actual en el selector
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los detalles de la orden: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar detalles de orden:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.router.navigate(['/orders']); // Redirigir si la orden no existe
        }
      }
    });
  }

  updateOrderStatus(): void {
    if (this.orderId !== null && this.selectedStatus !== null) {
      this.orderService.updateOrderStatus(this.orderId, this.selectedStatus).subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder; // Actualiza la orden con la respuesta del backend
          this.successMessage = 'Estado de la orden actualizado con éxito.';
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el estado: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al actualizar estado de orden:', err);
        }
      });
    }
  }
}
