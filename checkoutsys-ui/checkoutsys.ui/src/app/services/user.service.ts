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

  private userSource = new BehaviorSubject<User>(new User());
  currUser$ = this.userSource.asObservable();

  constructor(private http: HttpClient) { }

  public getUsers() : Observable<User[]> {
    return this.http.get<User[]>( 
      `${environment.apiUrl}/${this.url}`
      )
  }

  public getUser(id: Number) : Observable<User> {
    return this.http.get<User>( 
      `${environment.apiUrl}/${this.url}/byId/${id}`
      )
  }

  public login(username: String, password: String) : Observable<User> {
    var params = {'username' : username, 'password': password};
    return this.http.post<User>(
      `${environment.apiUrl}/${this.url}/login`, params
    )
  }

  public logout() : void {
    this.updateCurrUser(new User());
  }

  public register(fullName: String, username: String, email: String, password: String) : Observable<User> {
    var params = {'name' : fullName, 'username': username, 'email': email, 'password': password};
    return this.http.post<User>(
      `${environment.apiUrl}/${this.url}/register`, params
    )
  }

  public updateCurrUser(user: User) {
    this.userSource.next(user);
  }
}
