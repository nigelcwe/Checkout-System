import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private stockSource = new BehaviorSubject<boolean>(false);
  private detailsSource = new BehaviorSubject<boolean>(false);
  private addSource = new BehaviorSubject<boolean>(false);

  private productSource = new BehaviorSubject<Product>(new Product());

  currStock$ = this.stockSource.asObservable();
  currDetails$ = this.detailsSource.asObservable();
  currAdd$ = this.addSource.asObservable();

  currProduct$ = this.productSource.asObservable();

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

  public updateCurrProduct(product: Product) {
    this.productSource.next(product);
  }
}
