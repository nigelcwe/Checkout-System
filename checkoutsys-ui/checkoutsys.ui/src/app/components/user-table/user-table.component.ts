import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  userLst: any;
  interval: any;

  constructor(private userService: UserService) {}

  ngOnInit() : void {
    this.refreshUsers();
    // this.interval = setInterval(() => {
    //   this.refreshUsers();
    // }, 5000);
  }

  ngOnDestroy() : void {
    this.subscription.unsubscribe();
  }

  refreshUsers() {
    this.subscription.add(
      this.userService.getUsers()
      .subscribe(users => {
        this.userLst = users;
      })
    )
  }

}
