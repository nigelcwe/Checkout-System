import { ErrorService } from './services/error.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { CustomerComponent } from './components/customer/customer.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserTableComponent,
    HomeComponent,
    AdminComponent,
    CustomerComponent,
    RegistrationComponent,
    LoginComponent,
    ProductTableComponent,
    EditProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      {
        path: 'AdminHome',
        component: AdminComponent
      },
      {
        path: 'CustomerHome',
        component: CustomerComponent
      },
      {
        path: 'edit-product',
        component: EditProductComponent
      },

    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
