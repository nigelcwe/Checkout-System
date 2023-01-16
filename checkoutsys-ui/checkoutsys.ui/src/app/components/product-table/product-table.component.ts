import { UserService } from 'src/app/services/user.service';
import { ProductService } from './../../services/product.service';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  currUser!: User;
  productLst: any;
  interval: any;

  constructor(
    private productService: ProductService,
    private userService: UserService,

    ) {}

  ngOnInit() : void {
    this.subscription.add(this.userService.currUser$.subscribe( user => {
      this.currUser = user;
    }))
    this.refreshProducts();
    this.interval = setInterval(() => {
      this.refreshProducts();
    }, 10000);
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }

  refreshProducts() {
    this.subscription.add(
      this.productService.getProductsByAdminId(this.currUser.id)
      .subscribe(products => {
        this.productLst = products;
      })
    )
  }

}
