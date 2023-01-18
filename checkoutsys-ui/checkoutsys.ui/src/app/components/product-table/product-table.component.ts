import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from './../../services/product.service';
import { Observable } from 'rxjs/internal/Observable';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {
  private subscription: Subscription = new Subscription()
  dropDownBtn = document.getElementsByClassName('dropdown-toggle') as HTMLCollectionOf<HTMLElement>;
  currUser!: User;
  currProduct!: Product;
  adminProductLst: any;
  validProductLst: any;
  interval: any;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,

    ) {}

  ngOnInit() : void {
    this.subscription.add(this.authService.currUser$.subscribe( user => {
      this.currUser = user;
    }))
    this.subscription.add(this.productService.currProduct$.subscribe( product => {
      this.currProduct = product;
    }))
    this.refreshProducts();
    this.interval = setInterval(() => {
      this.refreshProducts();
    }, 10000);
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }

  refreshProducts() {
    if (this.currUser.role == "admin") {
      this.subscription.add(
        this.productService.getProductsByAdminId(this.currUser.id)
        .subscribe(products => {
          this.adminProductLst = products;
        })
      )
    } else if (this.currUser.role == "customer") {
      this.subscription.add(
        this.productService.getValidProducts()
        .subscribe(products => {
          this.validProductLst = products;
        })
      )
    }
  }

  getRowIndex(btn: HTMLButtonElement) {
    let tabIndex: number = <number>btn.closest('tr')?.rowIndex;
    if (this.currUser.role == "admin") {
      this.currProduct = this.adminProductLst[tabIndex];
    } else if (this.currUser.role == "customer") {
      this.currProduct = this.validProductLst[tabIndex];
    }

    this.productService.updateCurrProduct(this.currProduct);
  }

  editStock() {
    this.adminService.updateCurrStock(true);
    this.adminService.currStock$.subscribe(data => {
      console.log(data);
    }
    )
    this.router.navigateByUrl("/edit-product");
  }

  editDetails() {
    this.adminService.updateCurrDetails(true);
    this.adminService.currDetails$.subscribe(data => {
      console.log(data);
    }
    )
    this.router.navigateByUrl("/edit-product"); 
  }

  addProduct() {
    this.adminService.updateCurrAdd(true);
    this.adminService.currAdd$.subscribe(data => {
      console.log(data);
    }
    )
    this.router.navigateByUrl("/edit-product"); 
  }

  showProduct(btn: HTMLButtonElement) {
    this.getRowIndex(btn);
    this.router.navigateByUrl("/view-product")
  }
}
