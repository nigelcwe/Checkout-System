import { ErrorService } from './error.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = "Products";
  private productSource = new BehaviorSubject<Product>(new Product());
  currProduct$ = this.productSource.asObservable();

  constructor(private http: HttpClient,
    private errorService: ErrorService) { }

  // public getProducts() : Observable<Product[]> {
  //   return this.http.get<Product[]>( 
  //     `${environment.apiUrl}/${this.url}`
  //     )
  // }

  public getProduct(id: number) : Observable<Product> {
    return this.http.get<Product>(
      `${environment.apiUrl}/${this.url}/${id}`
    )
  }

  public getValidProducts() : Observable<Product[]> {
    return this.http.get<Product[]>(
      `${environment.apiUrl}/${this.url}/valid`
    ).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) this.errorService.updateCurrError(err);
      }
      return of();
    }))
  }

  public getProductsByAdminId(id: number) : Observable<Product[]> {
    return this.http.get<Product[]> (
      `${environment.apiUrl}/${this.url}/byUserId/${id}`
    ).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) this.errorService.updateCurrError(err);
      }
      return of();
    }))
  }

  public putProductStock(id: number, stock: number) : Observable<Product> {
    var params = {'stock': stock};
    return this.http.put<Product> (
      `${environment.apiUrl}/${this.url}/PutStock/${id}`, params
    )
  }

  public putProduct(id: number, name: string, details: string, price: number, stock: number) : Observable<Product> {
    var params = {
      'name': name,
      'details': details,
      'price': price,
      'stock': stock
    }
    return this.http.put<Product> (
      `${environment.apiUrl}/${this.url}/${id}`, params
    )
  }

  public postProduct(adminId: number, name: string, details: string, price: number, stock: number) : Observable<Product> {
    var params = {
      'adminId': adminId,
      'name': name,
      'details': details,
      'price': price,
      'stock': stock
    }
    return this.http.post<Product> (
      `${environment.apiUrl}/${this.url}`, params
    )
  }

  public updateCurrProduct(product: Product) {
    this.productSource.next(product);
  }
 }
