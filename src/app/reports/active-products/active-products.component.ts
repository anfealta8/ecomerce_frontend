import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductoService } from '../../services/product.service';
import { ProductoResponse } from '../../models/product.model';
import { AuthService } from '../../auth/auth.service'; // Para usar en el template si es necesario

@Component({
  selector: 'app-active-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './active-products.component.html',
  styleUrls: ['./active-products.component.scss']
})
export class ActiveProductsComponent implements OnInit {
  activeProducts: ProductoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    public authService: AuthService // Inyectado para uso en el template si necesitas mostrar/ocultar elementos
  ) { }

  ngOnInit(): void {
    this.loadActiveProducts();
  }

  loadActiveProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.productoService.getActiveProducts().subscribe({
      next: (data) => {
        this.activeProducts = data;
        this.isLoading = false;
        if (this.activeProducts.length === 0) {
          this.successMessage = 'No hay productos activos disponibles.';
        } else {
          this.successMessage = `Mostrando ${this.activeProducts.length} productos activos.`;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar productos activos: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar productos activos:', err);
      }
    });
  }
}
