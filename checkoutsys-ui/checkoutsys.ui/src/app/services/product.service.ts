import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = "Products";

  constructor(private http: HttpClient) { }

  public getProducts() : Observable<Product[]> {
    return this.http.get<Product[]>( 
      `${environment.apiUrl}/${this.url}`
      )
  }

  public getProductsByAdminId(id: number) : Observable<Product[]> {
    return this.http.get<Product[]> (
      `${environment.apiUrl}/${this.url}/byUserId/${id}`
    )
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
 }
