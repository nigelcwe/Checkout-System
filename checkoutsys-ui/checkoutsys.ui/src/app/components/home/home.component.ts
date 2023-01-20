import { TransactionService } from './../../services/transaction.service';
import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  year = new Date().getFullYear() - 1;
  transactionLst: any;
  currUser!: User;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private transactionService: TransactionService,

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
