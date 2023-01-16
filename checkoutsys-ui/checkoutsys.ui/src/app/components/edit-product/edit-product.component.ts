import { Subscription } from 'rxjs';
import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  private subscription = new Subscription();
  isStock = false;
  isDetails = false;
  isAdd = false;

  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.adminService.currStock$.subscribe(stock => {
      this.isStock = stock;
    }))
    this.subscription.add(this.adminService.currDetails$.subscribe(details => {
      this.isDetails = details;
    }))
    this.subscription.add(this.adminService.currAdd$.subscribe(add => {
      this.isAdd = add;
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }
}
