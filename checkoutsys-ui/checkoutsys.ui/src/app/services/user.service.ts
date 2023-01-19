import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "Users";

  constructor(protected http: HttpClient) { }

  public getUsers() : Observable<User[]> {
    return this.http.get<User[]>( 
      `${environment.apiUrl}/${this.url}`
      )
  }

  // public getUser(id: number) : Observable<User> {
  //   return this.http.get<User>( 
  //     `${environment.apiUrl}/${this.url}/byId/${id}`
  //     )
  // }

  public getUserFromToken(token: string) : Observable<User> {
    return this.http.get<User>(
      `${environment.apiUrl}/${this.url}/byToken/${token}`
    )
  }

  protected dbRegister(fullName: string, username: string, email: string, password: string) : Observable<User> {
    var params = {'name' : fullName, 'username': username, 'email': email, 'password': password};
    return this.http.post<User>(
      `${environment.apiUrl}/${this.url}/register`, params
    )
  }

  protected dbLogin(username: string, password: string) : Observable<string> {
    var params = {'username' : username, 'password': password};
    return this.http.post(
      `${environment.apiUrl}/${this.url}/login`, params, {
        responseType: 'text',
      }
    )
  }
}
