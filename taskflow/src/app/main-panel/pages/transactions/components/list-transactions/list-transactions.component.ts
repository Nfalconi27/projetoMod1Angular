import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { RouterService } from '../../../../../core/services/router.service';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';

@Component({
  selector: 'app-list-transactions',
  imports: [DatePipe, CurrencyPipe, NegativeValuesPipe],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly routerService = inject(RouterService);

  @Output() editEmitter = new EventEmitter<string>();

  transactions: Transaction[] = [];
  transactionTypesEnum = TransactionTypes;

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

  onDelete(id: string): void {
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
  }
}
