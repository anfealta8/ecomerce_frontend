import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // <-- ¡Añade RouterLink aquí!
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink // <-- ¡Añade RouterLink a los imports del componente!
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  userId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  availableRoles: string[] = ['USER', 'ADMIN'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = +id;
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.loadUser(this.userId);
      }
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[]]
    });
  }

  loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          roles: user.roles || []
        });
        this.userForm.get('password')?.setValidators([Validators.minLength(8)]);
        this.userForm.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar usuario: ' + (err.error?.message || 'Error desconocido');
        console.error('Error al cargar usuario:', err);
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('Formulario inválido. Errores:');
      Object.keys(this.userForm.controls).forEach(key => {
        const controlErrors = this.userForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Control: ' + key + ', Errores: ' + JSON.stringify(controlErrors));
        }
      });
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      return;
    }

    const userData: User = { ...this.userForm.value };

    if (this.isEditMode) {
      if (!userData.password || userData.password === '') {
        delete userData.password;
      }
      this.userService.updateUser(this.userId!, userData).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado exitosamente.';
          setTimeout(() => this.router.navigate(['/users']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar usuario: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al actualizar usuario:', err);
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado exitosamente.';
          this.userForm.reset({ roles: [] });
          setTimeout(() => this.router.navigate(['/users']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear usuario: ' + (err.error?.message || 'Error desconocido');
          console.error('Error al crear usuario:', err);
        }
      });
    }
  }

  onRoleChange(event: any): void {
    const roles = this.userForm.get('roles')?.value as string[];
    const role = event.target.value;
    if (event.target.checked) {
      roles.push(role);
    } else {
      const index = roles.indexOf(role);
      if (index > -1) {
        roles.splice(index, 1);
      }
    }
    this.userForm.get('roles')?.setValue(roles);
  }

  isRoleSelected(role: string): boolean {
    return (this.userForm.get('roles')?.value as string[] || []).includes(role);
  }

  get f() { return this.userForm.controls; }
}
