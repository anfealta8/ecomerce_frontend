import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, date pipe
import { RouterLink, Router } from '@angular/router'; // Para routerLink y navegación programática

import { ProductoService } from '../../services/product.service'; // Asegúrate de que esta ruta sea correcta
import { ProductoResponse } from '../../models/product.model'; // Asegúrate de que esta ruta sea correcta
import { AuthService } from '../../auth/auth.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // Necesario para la directiva routerLink en el HTML
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Propiedades para la confirmación de eliminación
  showConfirmModal: boolean = false;
  productToDeleteId: number | null = null;
  productToDeleteName: string | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    public authService: AuthService // Inyectar AuthService para usar en el template (ej. *ngIf="authService.isAdmin()")
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.productoService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar productos: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar productos:', err);
        // Redirige al login si es un problema de autenticación/autorización
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  viewProductDetails(id: number): void {
    // Implementa la navegación a una página de detalles del producto si tienes una
    console.log('Ver detalles del producto con ID:', id);
    // this.router.navigate(['/products/details', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  // Método para iniciar el proceso de confirmación de eliminación
  initiateDelete(product: ProductoResponse): void {
    this.productToDeleteId = product.id!;
    this.productToDeleteName = product.nombre; // Asumiendo que 'nombre' es el campo del nombre del producto
    this.showConfirmModal = true;
  }

  // Método para confirmar la eliminación (después de que el usuario acepta en el modal)
  confirmDeleteProduct(): void {
    if (this.productToDeleteId !== null) {
      this.productoService.deleteProduct(this.productToDeleteId).subscribe({
        next: () => {
          this.successMessage = `Producto '${this.productToDeleteName}' eliminado con éxito.`;
          this.loadProducts(); // Recargar la lista después de la eliminación
          this.cancelDelete(); // Cerrar el modal
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar producto: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al eliminar producto:', err);
          this.cancelDelete(); // Cerrar el modal incluso si hay un error
        }
      });
    }
  }

  // Método para cancelar la eliminación y cerrar el modal
  cancelDelete(): void {
    this.showConfirmModal = false;
    this.productToDeleteId = null;
    this.productToDeleteName = null;
  }
}
