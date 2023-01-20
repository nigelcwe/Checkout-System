import { Subscription } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
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
