import { TransactionService } from './../../services/transaction.service';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-transaction-display',
  templateUrl: './transaction-display.component.html',
  styleUrls: ['./transaction-display.component.css']
})
export class TransactionDisplayComponent implements OnInit {
  @Input() year!: number;
  transactionLst: Transaction[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private transactionService: TransactionService,

  ) { }

  ngOnInit(): void {
    this.subscription.add(this.transactionService.getByYear(this.year).subscribe(data => {
      this.transactionLst = data;
    }))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  calculateTotal() : number {
    var value = 0;
    for (var i of this.transactionLst) {
      value += (i as Transaction).totalPrice;
    }
    return value;
  }

}
