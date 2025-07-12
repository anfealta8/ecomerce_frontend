import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; 

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { HomeComponent } from './home/home.component';

import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductSearchComponent } from './products/product-search/product-search.component';

import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component'; // Para CRUD de usuario individual
import { TopFrequentCustomersReportComponent } from './users/top-frequent-customers-report/top-frequent-customers-report.component';

import { TopSoldProductsComponent } from './reports/top-sold-products/top-sold-products.component';
import { ActiveProductsComponent } from './reports/active-products/active-products.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'home', component: HomeComponent },

  { path: 'products', component: ProductListComponent },
  { path: 'products/detail/:id', component: ProductDetailComponent }, 
  { path: 'products/search', component: ProductSearchComponent },

  { path: 'users', component: UserListComponent },
  { path: 'users/detail/:id', component: UserDetailComponent }, 
  { path: 'reports/top-frequent-customers', component: TopFrequentCustomersReportComponent },

  { path: 'reports/top-sold-products', component: TopSoldProductsComponent },
  { path: 'reports/active-products', component: ActiveProductsComponent },

  { path: 'users', component: UserListComponent, canActivate: [authGuard] }, 
  { path: 'users/detail/:id', component: UserDetailComponent, canActivate: [authGuard] },
  { path: 'reports/top-frequent-customers', component: TopFrequentCustomersReportComponent, canActivate: [authGuard] },
  { path: 'reports/top-sold-products', component: TopSoldProductsComponent, canActivate: [authGuard] },
  

  { path: '**', redirectTo: '/home' }
];