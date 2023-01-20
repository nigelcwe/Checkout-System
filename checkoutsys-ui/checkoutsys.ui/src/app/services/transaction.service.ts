import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private url = "Transactions";

  constructor(
    private http:HttpClient,

  ) { }

  public getByYear(year: number) : Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${environment.apiUrl}/${this.url}/ByYear/${year}`
    )
  }
}
