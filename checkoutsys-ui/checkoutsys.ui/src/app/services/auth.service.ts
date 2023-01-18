import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private userService: UserService,

  ) { }

  async login(username: string, password: string) : Promise<boolean> {
    var currUser: User;

    try {
      var loginResult$ = this.userService.login(username, password);
      var token = await lastValueFrom(loginResult$);
      localStorage.setItem("authToken", token);
      var result$ = this.userService.getUserFromToken(<string>localStorage.getItem("authToken"))
      currUser = await lastValueFrom(result$);
      this.userService.updateCurrUser(currUser);
      return true;
    } catch (error) {
      return false;
    }
  }

  async register(user: User) : Promise<boolean> {
    var register: boolean = false;
    try {
      var registerResult$ = this.userService.register(
        user.name,
        user.username,
        user.email,
        user.password
      )
      var tempVar = await lastValueFrom(registerResult$);
      register = true;
      return register;
    } catch (error) {
      return register;
    }
  }

  public logout() : void {
    this.userService.updateCurrUser(new User());
    localStorage.removeItem("authToken");
  }
}
