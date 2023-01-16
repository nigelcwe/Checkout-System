import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private stockSource = new BehaviorSubject<boolean>(false);
  private detailsSource = new BehaviorSubject<boolean>(false);
  private addSource = new BehaviorSubject<boolean>(false);

  currStock$ = this.stockSource.asObservable();
  currDetails$ = this.detailsSource.asObservable();
  currAdd$ = this.addSource.asObservable();

  constructor() { }

  public updateCurrStock(bool: boolean) {
    this.stockSource.next(bool);
  }

  public updateCurrDetails(bool: boolean) {
    this.detailsSource.next(bool);
  }

  public updateCurrAdd(bool: boolean) {
    this.addSource.next(bool);
  }
}
