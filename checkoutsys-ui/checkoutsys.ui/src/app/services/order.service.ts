import { ErrorService } from './error.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  protected orderSource = new BehaviorSubject<Order>(new Order());
  currOrder$ = this.orderSource.asObservable();
  private url = 'Orders';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    
    ) { }

  public getIncompleteOrder(custId: number) : Observable<Order> {
    return this.http.get<Order>(
      `${environment.apiUrl}/${this.url}/GetIncomplete/${custId}`
    ).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) {
          this.errorService.updateCurrError(err);
          var errorMessage = `Error Code: ${err.status}\nMessage: ${err.error}`;
          window.alert(errorMessage);   
        }
      }
      return of();
    }))
  }

  public putOrder(orderId: number, customerId: number, date: Date, isCompleted: string) : Observable<Order> {
    var params = {
      'orderId': orderId,
      'customerId': customerId,
      'date': date,
      'isCompleted': isCompleted
    }
    return this.http.put<Order>(
      `${environment.apiUrl}/${this.url}/${orderId}`, params
    )
  }

  public postOrder(customerId: number, date: Date, isCompleted: string) : Observable<Order> {
    var params = {
      'customerId': customerId,
      'date': date,
      'isCompleted': isCompleted
    }
    return this.http.post<Order>(
      `${environment.apiUrl}/${this.url}`, params
    )
  }

  public updateCurrOrder(order: Order) {
    this.orderSource.next(order);
  }
}
