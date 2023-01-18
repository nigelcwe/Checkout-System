import { AuthService } from './services/auth.service';
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
    private authService: AuthService,
    private router: Router,

    ) {}

  ngOnInit() : void {
    this.subscription = this.authService.currUser$.subscribe(user => this.currUser = user)
  }

  ngOnDestroy() : void {
    this.subscription?.unsubscribe();
  }

  ngDoCheck() : void {
  }
}
