import { Router } from '@angular/router';
import { ErrorService } from './../../services/error.service';
import { OrderProducts } from './../../models/order-products';
import { OrderProductsService } from './../../services/order-products.service';
import { OrderService } from './../../services/order.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { R3SelectorScopeMode } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';

declare var window: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private subscription: Subscription = new Subscription;
  currUser!: User;
  currProduct!: Product;
  currOrder!: Order;
  currError!: Error;
  productLst: any;
  public formModal: any;
  loading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private orderProductsService: OrderProductsService,
    private productService: ProductService,
    private errorService: ErrorService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.subscription.add(this.authService.currUser$.subscribe(user => {
      this.currUser = user;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe(product => {
      this.currProduct = product;
    }))
    this.subscription.add(this.orderService.currOrder$.subscribe(order => {
      this.currOrder = order;
    }))
    this.refreshProductLst();
    this.subscription.add(this.errorService.currError$.subscribe(err => {
      this.currError = err;
    }))

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("cartModal")
    );


    // this.prepareList();
    this.formModal.show();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRowIndex(btn: HTMLButtonElement) {
    let tabIndex: number = <number>btn.closest('tr')?.rowIndex;
    var currRow = this.productLst[tabIndex];
    this.currProduct = currRow.product;
    this.productService.updateCurrProduct(this.currProduct);
  }

  calculatePrice(item: OrderProducts) {
    return Number(item.productQty) * Number(item.product?.price);
  }

  editQty() {
    this.router.navigateByUrl("/view-product");
  }

  refreshProductLst() {
    this.subscription.add(this.orderProductsService.currProductLst$.subscribe(lst => {
      this.productLst = lst;
    }))
  }

  async removeProduct(btn: HTMLButtonElement) {
    console.log("entered removeProduct()");
    let tabIndex: number = <number>btn.closest('tr')?.rowIndex;
    console.log("found index");
    this.orderProductsService.putByOrderId(this.currOrder.id, this.productLst.splice(tabIndex, 1));
    console.log("passed put request");
    this.orderProductsService.updateCurrProductLst(this.productLst.splice(tabIndex, 1));
    console.log("updated product list");
    this.refreshProductLst();
  }
}
