import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Transaction } from 'src/app/models/transaction';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() year!: number;
  private subscription: Subscription = new Subscription();
  transactionLst: number[] = [];
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec' 
    ],
    datasets: [
      { 
        data: [], 
        label: 'Total sales by month' 
      },
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  constructor(
    private transactionService: TransactionService,

  ) { }

  ngOnInit(): void {
    this.subscription.add(this.transactionService.getByYear(this.year).subscribe( data => {
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
        this.transactionLst.push(value);
        count ++;
      }
      console.log(this.transactionLst);
      var param: any = {data: this.transactionLst, labels: "Total Sales by Month"};
      console.log(param);
      this.barChartData.datasets.pop();
      this.barChartData.datasets.push(param);
    }))    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
