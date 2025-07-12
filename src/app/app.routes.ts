import { Routes } from '@angular/router';

// 1. Componentes de Autenticación
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// 2. Componente Home
import { HomeComponent } from './home/home.component';

// 3. Componentes de Productos
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ProductSearchComponent } from './products/product-search/product-search.component';

// 4. Componentes de Usuarios
import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component'; // Para CRUD de usuario individual
import { TopFrequentCustomersReportComponent } from './users/top-frequent-customers-report/top-frequent-customers-report.component';

// 5. Componentes de Reportes (adicionales, si los separaste así)
import { TopSoldProductsComponent } from './reports/top-sold-products/top-sold-products.component';
import { ActiveProductsComponent } from './reports/active-products/active-products.component';


export const routes: Routes = [
  // Redirección por defecto a la página de inicio
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Rutas de Autenticación
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas de la Aplicación Principal
  { path: 'home', component: HomeComponent },

  // Rutas de Productos
  { path: 'products', component: ProductListComponent },
  { path: 'products/detail/:id', component: ProductDetailComponent }, // Para ver detalles de un producto específico
  { path: 'products/search', component: ProductSearchComponent },

  // Rutas de Usuarios
  { path: 'users', component: UserListComponent },
  { path: 'users/detail/:id', component: UserDetailComponent }, // Para ver/editar/eliminar un usuario específico
  { path: 'reports/top-frequent-customers', component: TopFrequentCustomersReportComponent },

  // Rutas de Reportes
  { path: 'reports/top-sold-products', component: TopSoldProductsComponent },
  { path: 'reports/active-products', component: ActiveProductsComponent },


  // Ruta comodín para cualquier ruta no encontrada (redirige a home o a una página 404)
  { path: '**', redirectTo: '/home' }
];