import { Subscription } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';

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

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.userService.currUser$.subscribe(user => {
      this.currUser = user;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe(product => {
      this.currProduct = product;
    }))

    this.formModal = new window.bootstrap.Modal(
      document.getElementById("productModal")
    );

    this.formModal.show();
  }

}
