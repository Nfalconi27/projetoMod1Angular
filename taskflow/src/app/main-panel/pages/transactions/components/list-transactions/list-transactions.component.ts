import { Component, EventEmitter, inject, Output } from '@angular/core';
import { first, take } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { CurrencyPipe, DatePipe, AsyncPipe } from '@angular/common';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { MatCardTitle, MatCardHeader, MatCardModule } from "@angular/material/card";
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-list-transactions',
  imports: [DatePipe, CurrencyPipe, NegativeValuesPipe, MatCardTitle, MatCardHeader, MatCardModule, AsyncPipe],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent{
  // private readonly transactionsService = inject(TransactionsService);
  private readonly dashboardService = inject(DashboardService);  
  private readonly router = inject(Router);
  private transactionsService = inject(TransactionsService);

  
  @Output() editEmitter = new EventEmitter<string>();
  
  // transactions: Transaction[] = [];
  transactions = toSignal(this.transactionsService.getTransactions(), { 
    initialValue: [] as Transaction[]
  });
  transactionTypesEnum = TransactionTypes;
  account$ = this.dashboardService.account$;


  redirectToCreate(): void {
    this.router.navigate(['/transacoes/criar']);
  }

  onEdit(id: string): void {
    console.log('ID: ', id);
    
    this.router.navigate([`/transacoes/editar/${id}`]);
  }

  onDelete(id: string, amount:number): void {
    this.transactionsService
      .deleteTransaction(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.transactions();
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
