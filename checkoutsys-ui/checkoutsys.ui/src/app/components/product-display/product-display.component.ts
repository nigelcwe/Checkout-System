import { OrderService } from './../../services/order.service';
import { OrderProductsService } from './../../services/order-products.service';
import { AuthService } from './../../services/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order';

declare var window: any;

@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.css']
})
export class ProductDisplayComponent implements OnInit {
  private subscription = new Subscription();
  currUser!: User;
  currProduct!: Product;
  formModal: any;
  loading = false;
  submitted = false;
  productLst: any;
  currOrder!: Order;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private orderProductsService: OrderProductsService,
    private orderService: OrderService,

  ) { }

  form: FormGroup = new FormGroup({
    qty: new FormControl('')
  })

  ngOnInit(): void {
    this.subscription.add(this.authService.currUser$.subscribe(user => {
      this.currUser = user;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe(product => {
      this.currProduct = product;
    }))
    this.subscription.add(this.orderProductsService.currProductLst$.subscribe(lst => {
      this.productLst = lst;
    }))
    this.subscription.add(this.orderService.currOrder$.subscribe(order => {
      this.currOrder = order;
    }))

    this.form = this.formBuilder.group({
      qty: ['', [Validators.required, Validators.min(0)]]
    })

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("productModal")
    );

    this.formModal.show();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    if (this.f['qty'].value == 0) {
      var index = this.productLst.indexOf(this.currProduct);
      var temp = this.orderProductsService.putByOrderId(this.currOrder.id, this.productLst.splice(index, 1));
    }


  }

}
