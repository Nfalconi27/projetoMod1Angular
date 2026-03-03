import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { first, Observable, take } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { CurrencyPipe, DatePipe, AsyncPipe } from '@angular/common';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { RouterService } from '../../../../../core/services/router.service';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';
import { MatCardTitle, MatCardHeader, MatCardModule } from "@angular/material/card";
import { DashboardService } from '../../../dashboard/services/dashboard.service';

@Component({
  selector: 'app-list-transactions',
  imports: [DatePipe, CurrencyPipe, NegativeValuesPipe, MatCardTitle, MatCardHeader, MatCardModule, AsyncPipe],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly routerService = inject(RouterService);
  private readonly dashboardService = inject(DashboardService);  

  
  @Output() editEmitter = new EventEmitter<string>();
  
  transactions: Transaction[] = [];
  transactionTypesEnum = TransactionTypes;
  account$ = this.dashboardService.account$;
  
  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionsService
      .getTransactions()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.transactions = res;
          this.transactions = this.transactions
        .sort((a, b) => {
          const dataA = new Date(a.date).getTime();
          const dataB = new Date(b.date).getTime();

          return dataB - dataA; // mais recente primeiro
        })
          
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  redirectToCreate(): void {
    this.routerService.setTransactionPage(TransactionPagesEnum.CREATE);
  }

  onEdit(id: string): void {
    this.editEmitter.emit(id);
  }

  onDelete(id: string, amount:number): void {
    this.transactionsService
      .deleteTransaction(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getTransactions();
        },
        error: (err) => {
          console.log(err);
        },
      });
    amount = amount * (-1)
    this.account$
        .pipe(take(1))
        .subscribe(account => {
          const novoSaldo = +account!.balance + +amount; 
          this.updateBalance(novoSaldo);
        });
  }

  updateBalance(balance: number): void {
    this.dashboardService
    .updateBalance(balance)
    .pipe(first())
      .subscribe({
        next: () => {
          console.log('Saldo Atualizado!'); 
           
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
