import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  currUser!: User;

  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.subscription.add(this.authService.currUser$.subscribe(data => {
      this.currUser = data;
    }))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
