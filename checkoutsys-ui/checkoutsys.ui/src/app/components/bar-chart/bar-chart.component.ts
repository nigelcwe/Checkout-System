import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
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
        data: [
          this.transactionLst[0],
          this.transactionLst[1],
          this.transactionLst[2],
          this.transactionLst[3],
          this.transactionLst[4],
          this.transactionLst[5],
          this.transactionLst[6],
          this.transactionLst[7],
          this.transactionLst[8],
          this.transactionLst[9],
          this.transactionLst[10],
          this.transactionLst[11],
        ], 
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
    this.subscription.add(this.transactionService.getByYear(this.year).subscribe(data => {
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
      this.RenderChart();
    }))
  }

  RenderChart() {
    const myChart = new Chart("barChart", {
      type: 'bar',
      data: {
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
        datasets: [{
          label: 'Total Sales by Month ($)',
          data: this.transactionLst,
        }]
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
