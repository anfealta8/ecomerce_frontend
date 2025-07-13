import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { OrderListComponent } from './order/order-list/order-list.component'; 
import { OrderDetailComponent } from './order/order-detail/order-detail.component'; 
import { OrderFormComponent } from './order/order-form/order-form.component'; 
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component'; 
import { InventoryFormComponent } from './inventory/inventory-form/inventory-form.component'; 
import { ProductSearchComponent } from './products/product-search/product-search.component'; 
import { TopSoldProductsComponent } from './reports/top-sold-products/top-sold-products.component';
import { ActiveProductsComponent } from './reports/active-products/active-products.component'; 
import { TopFrequentCustomerComponent } from './users/top-frequent-customers-report/top-frequent-customers-report.component'; // ¡NUEVO!




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

  { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'orders/details/:id', component: OrderDetailComponent, canActivate: [AuthGuard] }, 
  { path: 'orders/new', component: OrderFormComponent, canActivate: [AuthGuard] }, 
  

  { path: 'inventories', component: InventoryListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'inventories/new', component: InventoryFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'inventories/edit/:id', component: InventoryFormComponent, canActivate: [AuthGuard, AdminGuard] },

  { path: 'search-products', component: ProductSearchComponent, canActivate: [AuthGuard] },
  { path: 'top-sold', component: TopSoldProductsComponent, canActivate: [AuthGuard] },
  { path: 'active-products', component: ActiveProductsComponent, canActivate: [AuthGuard] }, 
  { path: 'frequent-customers', component: TopFrequentCustomerComponent, canActivate: [AuthGuard, AdminGuard] }, 


  { path: '**', redirectTo: '/home' }
];
