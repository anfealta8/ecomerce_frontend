import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 

import { ProductoService } from '../../services/product.service'; 
import { ProductoRequest, ProductoResponse } from '../../models/product.model'; 

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: number | null = null;
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductForEdit(this.productId);
      }
    });
  }

  // Método para inicializar el formulario con validaciones
  initializeForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
      sku: ['', [Validators.required, Validators.minLength(3)]], // <-- AÑADIDO: sku con validaciones
      precio: [0, [Validators.required, Validators.min(0.01)]],
      activo: [true]
      // stock y imageUrl ELIMINADOS del formulario
    });
  }

  // Carga los datos del producto si estamos en modo edición
  loadProductForEdit(id: number): void {
    this.loading = true;
    this.productoService.getProductById(id).subscribe({
      next: (product: ProductoResponse) => {
        // Asegúrate de que las propiedades del backend coincidan aquí
        this.productForm.patchValue({
          id: product.id, // ID no está en el form, pero es bueno verificar
          nombre: product.nombre,
          descripcion: product.descripcion,
          categoria: product.categoria,
          sku: product.sku, // <-- AÑADIDO
          precio: product.precio,
          activo: product.activo
          // stock y imageUrl ya no se esperan aquí
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto para edición:', err);
        this.error = 'No se pudo cargar el producto para edición.';
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    this.successMessage = null;
    this.error = null;

    if (this.productForm.valid) {
      this.loading = true;
      // Asegúrate de que los datos enviados coincidan con ProductoRequest del backend
      const productData: ProductoRequest = {
        nombre: this.productForm.value.nombre,
        descripcion: this.productForm.value.descripcion,
        categoria: this.productForm.value.categoria,
        sku: this.productForm.value.sku, // <-- AÑADIDO
        precio: this.productForm.value.precio,
        activo: this.productForm.value.activo
        // stock y imageUrl ELIMINADOS de los datos a enviar
      };

      if (this.isEditMode && this.productId !== null) {
        this.productoService.updateProduct(this.productId, productData).subscribe({
          next: () => {
            this.successMessage = 'Producto actualizado exitosamente.';
            this.loading = false;
            setTimeout(() => this.router.navigate(['/products']), 2000);
          },
          error: (err) => {
            console.error('Error al actualizar producto:', err);
            this.error = 'No se pudo actualizar el producto: ' + (err.error?.message || 'Error desconocido.');
            this.loading = false;
          }
        });
      } else {
        this.productoService.createProduct(productData).subscribe({
          next: () => {
            this.successMessage = 'Producto creado exitosamente.';
            this.loading = false;
            this.productForm.reset({ activo: true });
            setTimeout(() => this.router.navigate(['/products']), 2000);
          },
          error: (err) => {
            console.error('Error al crear producto:', err);
            this.error = 'No se pudo crear el producto: ' + (err.error?.message || 'Error desconocido.');
            this.loading = false;
          }
        });
      }
    } else {
      this.error = 'Por favor, completa todos los campos requeridos correctamente.';
      this.productForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  get f() { return this.productForm.controls; }
}
