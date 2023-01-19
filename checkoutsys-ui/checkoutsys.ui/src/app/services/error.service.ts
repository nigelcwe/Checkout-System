import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  protected errorSource = new BehaviorSubject<Error>(new Error());
  currError$ = this.errorSource.asObservable();

  constructor() { }
  
  public updateCurrError(error: Error) {
    this.errorSource.next(error);
    console.log(error);
  }

  public removeCurrError() {
    this.errorSource.next(new Error());
  }
}
