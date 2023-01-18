import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currUser!: User;
  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.currUser$.subscribe(user => this.currUser = user)
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe();
  }

  ngOnView(): void {
  }

}
