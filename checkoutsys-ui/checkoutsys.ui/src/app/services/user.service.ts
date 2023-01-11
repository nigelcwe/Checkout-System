import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public getUsers() : User[] {
    let user = new User();
    user.id = 1;
    user.name = "John Doe";
    user.username = "johndoe";
    user.email = "johndoe@gmail.com";
    user.password = "johndoe123";
    user.role = "admin";
  }
}
