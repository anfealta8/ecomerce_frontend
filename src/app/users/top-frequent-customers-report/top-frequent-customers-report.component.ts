import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../services/user.service'; // Usamos UserService para obtener clientes
import { TopFrequentCustomerResponse } from '../../models/report.model'; // Importa el modelo de reporte
import { AuthService } from '../../auth/auth.service'; // Para verificar roles

@Component({
  selector: 'app-frequent-customers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './top-frequent-customers-report.component.html',
  styleUrls: ['./top-frequent-customers-report.component.scss']
})
export class TopFrequentCustomerComponent implements OnInit {
  frequentCustomers: TopFrequentCustomerResponse[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService, // Inyecta UserService
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadFrequentCustomers();
  }

  loadFrequentCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.userService.getTop5FrequentCustomers().subscribe({
      next: (data) => {
        this.frequentCustomers = data;
        this.isLoading = false;
        if (this.frequentCustomers.length === 0) {
          this.successMessage = 'No hay clientes frecuentes disponibles.';
        } else {
          this.successMessage = `Mostrando los ${this.frequentCustomers.length} clientes más frecuentes.`;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar clientes frecuentes: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar clientes frecuentes:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
