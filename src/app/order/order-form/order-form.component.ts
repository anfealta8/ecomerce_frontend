import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service'; // Necesario para obtener usuarios
import { ProductoService } from '../../services/product.service'; // Necesario para obtener productos
import { OrderRequest, OrderDetailRequest, OrderResponse } from '../../models/order.model';
import { User } from '../../models/user.model'; // Modelo de usuario
import { ProductoResponse } from '../../models/product.model'; // Modelo de producto

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  users: User[] = [];
  products: ProductoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private userService: UserService,
    private productoService: ProductoService,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      usuarioId: ['', Validators.required],
      detalles: this.fb.array([], Validators.required), // FormArray para los detalles de la orden
      aplicarDescuentoAleatorio: [false]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
    this.addOrderDetail(); // Añade un detalle de orden vacío al iniciar
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'Error al cargar la lista de usuarios.';
      }
    });
  }

  loadProducts(): void {
    this.productoService.getProducts().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.activo); // Solo productos activos
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMessage = 'Error al cargar la lista de productos.';
      }
    });
  }

  // Getter para acceder fácilmente al FormArray de detalles
  get detalles(): FormArray {
    return this.orderForm.get('detalles') as FormArray;
  }

  // Método para añadir un nuevo grupo de detalle de orden al FormArray
  addOrderDetail(): void {
    const detailGroup = this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
    this.detalles.push(detailGroup);
  }

  // Método para eliminar un grupo de detalle de orden del FormArray
  removeOrderDetail(index: number): void {
    this.detalles.removeAt(index);
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      this.isLoading = false;
      console.log('Formulario de orden inválido:', this.orderForm.errors);
      this.detalles.controls.forEach((control, index) => {
        console.log(`Detalle ${index} errores:`, control.errors);
        Object.keys((control as FormGroup).controls).forEach(key => {
          const itemControlErrors = (control as FormGroup).get(key)?.errors;
          if (itemControlErrors != null) {
            console.log(`Detalle ${index}, Control ${key}, Errores:`, JSON.stringify(itemControlErrors));
          }
        });
      });
      return;
    }

    const orderRequest: OrderRequest = this.orderForm.value;

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response: OrderResponse) => {
        this.successMessage = `Orden ${response.id} creada con éxito.`;
        this.isLoading = false;
        this.orderForm.reset({ aplicarDescuentoAleatorio: false });
        this.detalles.clear(); // Limpia los detalles
        this.addOrderDetail(); // Añade un detalle vacío para una nueva orden
        setTimeout(() => this.router.navigate(['/orders']), 2000); // Redirige después de 2 segundos
      },
      error: (err) => {
        this.errorMessage = 'Error al crear la orden: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al crear la orden:', err);
      }
    });
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get f() { return this.orderForm.controls; }
}
