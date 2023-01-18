import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private subscription: Subscription = new Subscription()
  dropDownBtn = document.getElementsByClassName('dropdown-toggle') as HTMLCollectionOf<HTMLElement>;
  currUser!: User;
  currProduct!: Product;
  productLst: any;
  interval: any;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private adminService: AdminService,
    private router: Router,

    ) {}

  ngOnInit() : void {
    this.subscription.add(this.userService.currUser$.subscribe( user => {
      this.currUser = user;
    }))
    this.subscription.add(this.adminService.currProduct$.subscribe( product => {
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
    this.subscription.add(
      this.productService.getProductsByAdminId(this.currUser.id)
      .subscribe(products => {
        this.productLst = products;
      })
    )
  }

  getRowIndex(btn: HTMLButtonElement) {
    let tabIndex: number = <number>btn.closest('tr')?.rowIndex;
    this.currProduct = this.productLst[tabIndex];
    this.adminService.updateCurrProduct(this.currProduct);
  }

  editStock() {
    clearInterval(this.interval);
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
}
