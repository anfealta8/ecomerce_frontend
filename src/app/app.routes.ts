import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard'; // Necesitarás crear este guard

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] }, 

  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'users/new', component: UserFormComponent, canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthGuard, AdminGuard] }, 

  { path: '**', redirectTo: '/home' }
];
