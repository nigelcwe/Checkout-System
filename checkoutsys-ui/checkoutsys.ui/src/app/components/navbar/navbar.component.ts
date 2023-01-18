import { AuthService } from './../../services/auth.service';
import { AdminService } from './../../services/admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

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
  private subscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService,

    ) {
  }

  ngOnInit() : void {
    this.subscription = this.userService.currUser$.subscribe(user => this.currUser = user)
    this.subscription.add(this.adminService.currStock$.subscribe(stock => {
      this.currStock = stock;
    }))
    this.subscription.add(this.adminService.currDetails$.subscribe(details => {
      this.currDetails = details;
    }))
    this.subscription.add(this.adminService.currAdd$.subscribe(add => {
      this.currAdd = add;
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
}
