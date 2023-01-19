import { OrderProducts } from './../models/order-products';
import { ErrorService } from './error.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderProductsService {
  private url = 'OrderProducts';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,

  ) { }

  public getByOrderId(orderId: number) : Observable<OrderProducts[]> {
    return this.http.get<OrderProducts[]>(
      `${environment.apiUrl}/${this.url}/GetByOrder/${orderId}`
    ).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) this.errorService.updateCurrError(err);
      }
      return of();
    }))
  }

  public putByOrderId(orderId: number, productId: number, productQty: number) : Observable<OrderProducts> {
    var params = {
      'orderId': orderId,
      'productId': productId,
      'productQty': productQty
    }
    return this.http.put<OrderProducts>(
      `${environment.apiUrl}/${this.url}/PutByOrder/${orderId}`, params
    )
  }

  public postByOrder(orderId: number, productId: number, productQty: number) : Observable<OrderProducts> {
    var params = {
      'orderId': orderId,
      'productId': productId,
      'productQty': productQty
    }
    return this.http.post<OrderProducts>(
      `${environment.apiUrl}/${this.url}/PutByOrder/${orderId}`, params
    )
  }
}
