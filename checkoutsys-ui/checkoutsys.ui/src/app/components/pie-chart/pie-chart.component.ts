import { Subscription, lastValueFrom } from 'rxjs';
import { TransactionService } from './../../services/transaction.service';
import { Transaction } from './../../models/transaction';
import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartItem } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  subscription: Subscription = new Subscription();
  transactionLst: number[] = [];
  chart = (document.getElementById("pieChart"));
  @Input() year!: number;
  title = 'ng2-charts-demo';

  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
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

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
  };
  
  constructor(
    private transactionService: TransactionService,

  ) { }

  async ngOnInit() {
    // var result$ = this.transactionService.getByYear(this.year);
    // this.transactionLst = await lastValueFrom(result$).then();
    this.subscription.add(this.transactionService.getByYear(this.year).subscribe( data => {
      var count = 0;
      while (count <= 11) {
        console.log(count);
        var value = 0;
        for (var i of data) {
          console.log(data);
          var item = i as Transaction;
          var dt = new Date(item.date);
          if (dt.getMonth() == count) {
            value += item.totalPrice;
          }
        }
        this.transactionLst.push(value);

        console.log(this.transactionLst);
        count ++;
      }
      console.log(this.transactionLst);
      var params = { 
        data: this.transactionLst, 
        label: 'Total Sales by Month' 
      };
      this.pieChartData.datasets.pop();
      this.pieChartData.datasets.push(params);

      // var tempData = JSON.stringify(this.transactionLst);
      // this.pieChartDatasets = JSON.parse(tempData);
    }))

    console.log(this.transactionLst);

    // for (var i of this.transactionLst) {
    //   console.log((i as Transaction).date.getMonth());
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async calculateByMonth(month: number) {
    var value = 0;
    var result$ = this.transactionService.getByYear(month);
    var tempLst: Transaction[] = await lastValueFrom(result$);
    console.log(tempLst);
    for (var i of tempLst) {
      if ((i as Transaction).date.getMonth() == month) {
        value += i.totalPrice;
      }
    }
    console.log(value);
    return value;
  }

}
