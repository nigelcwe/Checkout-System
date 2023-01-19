import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './../../services/error.service';
import { OrderProducts } from './../../models/order-products';
import { OrderProductsService } from './../../services/order-products.service';
import { OrderService } from './../../services/order.service';
import { AuthService } from './../../services/auth.service';
import { AdminService } from './../../services/admin.service';
import { Router } from '@angular/router';
import { Subscription, lastValueFrom } from 'rxjs';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/models/order';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currUser!: User;
  currStock!: boolean;
  currDetails!: boolean;
  currAdd!: boolean;
  currOrder!: Order;
  productLst: any;
  currError!: Error;
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,
    private orderService: OrderService,
    private orderProductsService: OrderProductsService,
    private errorService: ErrorService,
    private productService: ProductService,

    ) {
  }

  ngOnInit() : void {
    this.subscription = this.authService.currUser$.subscribe(user => this.currUser = user)
    this.subscription.add(this.adminService.currStock$.subscribe(stock => {
      this.currStock = stock;
    }))
    this.subscription.add(this.adminService.currDetails$.subscribe(details => {
      this.currDetails = details;
    }))
    this.subscription.add(this.adminService.currAdd$.subscribe(add => {
      this.currAdd = add;
    }))
    this.subscription.add(this.orderService.currOrder$.subscribe(order => {
      this.currOrder = order;
    }))
    this.subscription.add(this.errorService.currError$.subscribe(err => {
      this.currError = err;
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    console.log(localStorage.getItem("authToken"));
    this.router.navigateByUrl('');
  }

  addProduct() {
    this.adminService.updateCurrAdd(true);
    this.adminService.currAdd$.subscribe(data => {
      console.log(data);
    }
    )
    this.router.navigateByUrl("/edit-product"); 
  }

  async toCart() {
    var orderResult$ = this.orderService.getIncompleteOrder(this.currUser.id);
    this.orderService.updateCurrOrder(await lastValueFrom(orderResult$));

    if (this.currError instanceof HttpErrorResponse) {
      if (this.currError.status == 404) {
        var errorMessage = `Error Code: ${this.currError.status}\nMessage: ${this.currError.error}`;
        window.alert(errorMessage);
        return;
      }
    }
    

    var result$ = this.orderProductsService.getByOrderId(this.currOrder.id);
    var tempLst = await lastValueFrom(result$);
    var newLst: OrderProducts[] = [];
    // var item: any;
    tempLst.forEach(async (item) => {
      var lstResult$ = this.productService.getProduct(item.productId);
      item.product = await lastValueFrom(lstResult$);
      newLst.push(item);
    })
    // for (item in tempLst) {
    //   if (item instanceof OrderProducts) {
    //     var lstResult$ = this.productService.getProduct(item.productId);
    //     item.product = await lastValueFrom(lstResult$);
    //     newLst.push(item);
    //   }
    // }

    console.log(newLst);

    this.orderProductsService.updateCurrProductLst(tempLst);
    
    this.router.navigateByUrl("/cart");
  }
}
