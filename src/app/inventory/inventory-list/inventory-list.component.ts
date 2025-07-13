import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryResponse } from '../../models/inventory.model';
import { AuthService } from '../../auth/auth.service'; // Para verificar roles

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventories: InventoryResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Para el modal de confirmación de eliminación
  showConfirmModal: boolean = false;
  inventoryToDeleteId: number | null = null;
  inventoryToDeleteProductName: string | null = null;

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.inventoryService.getAllInventories().subscribe({
      next: (data) => {
        this.inventories = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar inventarios: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar inventarios:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  editInventory(id: number): void {
    this.router.navigate(['/inventories/edit', id]);
  }

  // Lógica para el modal de eliminación
  initiateDelete(inventory: InventoryResponse): void {
    this.inventoryToDeleteId = inventory.id;
    this.inventoryToDeleteProductName = inventory.nombreProducto;
    this.showConfirmModal = true;
  }

  confirmDeleteInventory(): void {
    if (this.inventoryToDeleteId !== null) {
      this.inventoryService.deleteInventory(this.inventoryToDeleteId).subscribe({
        next: () => {
          this.successMessage = `Registro de inventario para '${this.inventoryToDeleteProductName}' eliminado con éxito.`;
          this.loadInventories(); // Recargar la lista
          this.cancelDelete(); // Cerrar el modal
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar registro de inventario: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al eliminar inventario:', err);
          this.cancelDelete(); // Cerrar el modal incluso si hay error
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.inventoryToDeleteId = null;
    this.inventoryToDeleteProductName = null;
  }
}
