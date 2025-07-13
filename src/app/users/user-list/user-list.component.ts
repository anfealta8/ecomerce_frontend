import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  showConfirmModal: boolean = false;
  userToDeleteId: number | null = null;
  userToDeleteUsername: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuarios: ' + (err.error?.message || 'Error desconocido');
        this.isLoading = false;
        console.error('Error al cargar usuarios:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  initiateDelete(user: User): void {
    this.userToDeleteId = user.id!;
    this.userToDeleteUsername = user.username;
    this.showConfirmModal = true;
  }

  confirmDeleteUser(): void {
    if (this.userToDeleteId !== null) {
      this.userService.deleteUser(this.userToDeleteId).subscribe({
        next: () => {
          this.successMessage = `Usuario '${this.userToDeleteUsername}' eliminado con éxito.`;
          this.loadUsers(); 
          this.cancelDelete(); 
        },
        error: (err) => {
          this.errorMessage = 'Error al eliminar usuario: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al eliminar usuario:', err);
          this.cancelDelete(); 
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.userToDeleteId = null;
    this.userToDeleteUsername = null;
  }
}
