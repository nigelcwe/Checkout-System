import { Component } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'checkoutsys.ui';
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() : void {
    this.users = this.userService.getUsers();
    console.log(this.users);
  }
}
