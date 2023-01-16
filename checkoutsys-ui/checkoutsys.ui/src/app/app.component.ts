import { Product } from './models/product';
import { Component } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'checkoutsys.ui';
  subscription?: Subscription;
  currUser!: User;
  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router,

    ) {}

  ngOnInit() : void {
    this.subscription = this.userService.currUser$.subscribe(user => this.currUser = user)
    // this.userService.getUser(3).subscribe(user => {
    //   this.currUser = user;
    // })
    // if (this.currUser.role == "admin")
    //   this.router.navigateByUrl("/AdminHome")
    // else if (this.currUser.role == "customer")
    //   this.router.navigateByUrl("/CustomerHome");
  }

  ngOnDestroy() : void {
    this.subscription?.unsubscribe();
  }

  ngDoCheck() : void {
  }
}
