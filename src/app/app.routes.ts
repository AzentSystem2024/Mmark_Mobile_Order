import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { TransferInComponent } from './transfer-in/transfer-in.component';
import { TransferOutComponent } from './transfer-out/transfer-out.component';
import { AtricleInventoryComponent } from './Article_inventroy/atricle-inventory/atricle-inventory.component';
import { CartonInventoryComponent } from './Carton_inventory/carton-inventory/carton-inventory.component';
import { LayoutComponent } from './layout/layout.component';
import { AddArticleInventoryComponent } from './Article_inventroy/add-article-inventory/add-article-inventory.component';
import { EditArticleInventoryComponent } from './Article_inventroy/edit-article-inventory/edit-article-inventory.component';
import { CartonEditComponent } from './Carton_inventory/carton-edit/carton-edit.component';
import { CartonAddComponent } from './Carton_inventory/carton-add/carton-add.component';
import { HomeComponent } from './home/home.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { AuthGuard } from './auth.guard';
import { CartComponent } from './cart/cart.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { ViewOrderListComponent } from './view-order-list/view-order-list.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { RetailerFormComponent } from './retailer-form/retailer-form.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent }, // Login page
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'new-order', component: NewOrderComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  {
    path: 'view-order/:id',
    component: ViewOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view-order-list',
    component: ViewOrderListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-order/:index',
    component: EditOrderComponent,
    canActivate: [AuthGuard],
  },
  { path: 'retailer-Add', component: RetailerFormComponent },
  { path: 'layout', component: LayoutComponent }, // Landing page
  { path: 'transfer-out', component: TransferOutComponent },
  { path: 'transfer-in', component: TransferInComponent },
  { path: 'article-inventory', component: AtricleInventoryComponent },
  { path: 'add-article-inventory', component: AddArticleInventoryComponent },
  { path: 'edit-article-inventory', component: EditArticleInventoryComponent },
  { path: 'carton-inventory', component: CartonInventoryComponent },
  { path: 'add-carton-inventory', component: CartonAddComponent },
  { path: 'edit-carton-inventory', component: CartonEditComponent },
  { path: '**', redirectTo: '' }, // fallback to login
];
