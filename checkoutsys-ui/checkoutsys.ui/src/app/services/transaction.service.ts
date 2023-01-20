import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  protected chartDataSource = new BehaviorSubject<number[]>([]);
  chartData$ = this.chartDataSource.asObservable();
  private url = "Transactions";

  constructor(
    private http:HttpClient,

  ) { }

  public getByYear(year: number) : Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${environment.apiUrl}/${this.url}/ByYear/${year}`
    )
  }

  public updateChartData(year: number) {
    this.getByYear(year).subscribe(data => {
      var tempLst: number[] = [];
      var count = 0;
      while (count <= 11) {
        var value = 0;
        for (var i of data) {
          var item = i as Transaction;
          var dt = new Date(item.date);
          if (dt.getMonth() == count) {
            value += item.totalPrice;
          }
        }
        tempLst.push(value);
        count ++;
      }
      console.log(tempLst);

      this.chartDataSource.next(tempLst);
    })
  }
}
