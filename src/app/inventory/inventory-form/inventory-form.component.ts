import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InventoryService } from '../../services/inventory.service';
import { ProductoService } from '../../services/product.service'; // Necesario para obtener productos
import { InventoryRequest, InventoryResponse } from '../../models/inventory.model';
import { ProductoResponse } from '../../models/product.model'; // Modelo de producto

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  isEditMode: boolean = false;
  inventoryId: number | null = null;
  products: ProductoResponse[] = []; // Lista de productos para el selector
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.inventoryForm = this.fb.group({
      productoId: ['', Validators.required],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]],
      cantidadReservada: [0, [Validators.required, Validators.min(0)]],
      cantidadMinima: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts(); // Carga la lista de productos al iniciar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.inventoryId = +id;
        this.loadInventory(this.inventoryId);
      }
    });
  }

  loadProducts(): void {
    this.productoService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error al cargar productos para el formulario de inventario:', err);
        this.errorMessage = 'Error al cargar la lista de productos.';
      }
    });
  }

  loadInventory(id: number): void {
    this.isLoading = true;
    this.inventoryService.getInventoryById(id).subscribe({
      next: (inventory) => {
        this.inventoryForm.patchValue({
          productoId: inventory.productoId,
          cantidadDisponible: inventory.cantidadDisponible,
          cantidadReservada: inventory.cantidadReservada,
          cantidadMinima: inventory.cantidadMinima
        });
        // Deshabilitar el selector de producto en modo edición si no se permite cambiar el producto asociado
        this.inventoryForm.get('productoId')?.disable();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el registro de inventario: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar inventario:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.router.navigate(['/inventories']); // Redirigir si no se encuentra
        }
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      this.isLoading = false;
      console.log('Formulario de inventario inválido:', this.inventoryForm.errors);
      return;
    }

    // Habilitar el campo productoId temporalmente para enviar su valor en el request
    if (this.isEditMode) {
      this.inventoryForm.get('productoId')?.enable();
    }

    const inventoryData: InventoryRequest = this.inventoryForm.value;

    if (this.isEditMode && this.inventoryId) {
      this.inventoryService.updateInventory(this.inventoryId, inventoryData).subscribe({
        next: (response) => {
          this.successMessage = `Inventario para '${response.nombreProducto}' actualizado con éxito.`;
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/inventories']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar inventario: ' + (err.error?.message || 'Error desconocido');
          this.isLoading = false;
          console.error('Error al actualizar inventario:', err);
        }
      });
    } else {
      this.inventoryService.createInventory(inventoryData).subscribe({
        next: (response) => {
          this.successMessage = `Registro de inventario para '${response.nombreProducto}' creado con éxito.`;
          this.isLoading = false;
          this.inventoryForm.reset({
            cantidadDisponible: 0,
            cantidadReservada: 0,
            cantidadMinima: 0
          });
          setTimeout(() => this.router.navigate(['/inventories']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear inventario: ' + (err.error?.message || 'Error desconocido');
          this.isLoading = false;
          console.error('Error al crear inventario:', err);
        }
      });
    }
    // Volver a deshabilitar el campo productoId si estábamos en modo edición
    if (this.isEditMode) {
      this.inventoryForm.get('productoId')?.disable();
    }
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get f() { return this.inventoryForm.controls; }
}
