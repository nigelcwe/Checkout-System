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

  public getProductsByAdminId(id: Number) : Observable<Product[]> {
    return this.http.get<Product[]> (
      `${environment.apiUrl}/${this.url}/byUserId/${id}`
    )
  }
 }
