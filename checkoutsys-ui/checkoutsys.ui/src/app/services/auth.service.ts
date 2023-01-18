import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends UserService{
  protected userSource = new BehaviorSubject<User>(new User());
  currUser$ = this.userSource.asObservable();

  constructor(
    protected override http: HttpClient,
  ) {
    super(
      http
    );
  }

  async login(username: string, password: string) : Promise<boolean> {
    var currUser: User;

    try {
      var loginResult$ = this.dbLogin(username, password);
      var token = await lastValueFrom(loginResult$);
      localStorage.setItem("authToken", token);
      var result$ = this.getUserFromToken(<string>localStorage.getItem("authToken"))
      currUser = await lastValueFrom(result$);
      console.log(currUser);
      this.updateCurrUser(currUser);
      // this.userSource.next(currUser);
      this.currUser$.subscribe(user =>
        console.log(user));
      return true;
    } catch (error) {
      return false;
    }
  }

  async register(user: User) : Promise<boolean> {
    var register: boolean = false;
    try {
      var registerResult$ = this.dbRegister(
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
    this.updateCurrUser(new User());
    localStorage.removeItem("authToken");
  }

  public updateCurrUser(user: User) {
    this.userSource.next(user);
  }
}
