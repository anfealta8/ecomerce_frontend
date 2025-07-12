// src/app/products/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router'; 

import { ProductoService } from '../product.service'; 
import { ProductoResponse } from '../../models/product.models'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: ProductoResponse[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.productoService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }

  // Método para eliminar un producto (solo para usuarios ADMIN)
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Producto eliminado con éxito:', id);
          this.products = this.products.filter(p => p.id !== id); // Elimina de la lista local
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('No se pudo eliminar el producto. ' + (err.error?.message || 'Error desconocido.'));
        }
      });
    }
  }
}