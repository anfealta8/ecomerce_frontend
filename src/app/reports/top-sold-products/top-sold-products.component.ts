import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductoService } from '../../services/product.service';
import { ProductoResponse } from '../../models/product.model'; // Usamos ProductoResponse
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-top-sold-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './top-sold-products.component.html',
  styleUrls: ['./top-sold-products.component.scss']
})
export class TopSoldProductsComponent implements OnInit {
  topSoldProducts: ProductoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadTopSoldProducts();
  }

  loadTopSoldProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.productoService.getTop5SoldProducts().subscribe({
      next: (data) => {
        this.topSoldProducts = data;
        this.isLoading = false;
        if (this.topSoldProducts.length === 0) {
          this.successMessage = 'No hay productos más vendidos disponibles.';
        } else {
          this.successMessage = `Mostrando los ${this.topSoldProducts.length} productos más vendidos.`;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los productos más vendidos: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar top vendidos:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
