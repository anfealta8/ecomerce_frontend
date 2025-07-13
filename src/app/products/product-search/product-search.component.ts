import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/product.service';
import { ProductoResponse } from '../../models/product.model';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs'; // <-- ¡Añade esta importación!

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: ProductoResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Opciones de búsqueda
  searchOptions: string[] = ['nombre', 'categoria'];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.searchForm = this.fb.group({
      searchBy: ['nombre', Validators.required],
      searchTerm: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Puedes precargar algunos resultados o dejarlo vacío
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.searchResults = [];
    this.isLoading = true;

    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      this.errorMessage = 'Por favor, introduce un término de búsqueda.';
      this.isLoading = false;
      return;
    }

    const searchBy = this.searchForm.get('searchBy')?.value;
    const searchTerm = this.searchForm.get('searchTerm')?.value;

    let searchObservable: Observable<ProductoResponse[]>;

    if (searchBy === 'nombre') {
      searchObservable = this.productoService.searchProductsByName(searchTerm);
    } else if (searchBy === 'categoria') {
      searchObservable = this.productoService.searchProductsByCategory(searchTerm);
    } else {
      this.errorMessage = 'Criterio de búsqueda no válido.';
      this.isLoading = false;
      return;
    }

    searchObservable.subscribe({
      next: (data: ProductoResponse[]) => { // <-- Tipo explícito para 'data'
        this.searchResults = data;
        this.isLoading = false;
        if (this.searchResults.length === 0) {
          this.successMessage = 'No se encontraron productos para la búsqueda.';
        } else {
          this.successMessage = `Se encontraron ${this.searchResults.length} productos.`;
        }
      },
      error: (err: any) => { // <-- Tipo explícito para 'err' (puedes usar HttpErrorResponse si importas)
        this.errorMessage = 'Error al realizar la búsqueda: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error en la búsqueda de productos:', err);
      }
    });
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get f() { return this.searchForm.controls; }
}
