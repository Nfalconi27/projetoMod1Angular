import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { NegativeValuesPipe } from '../../../../../shared/pipes/negative-values.pipe';
import { Account } from '../../../dashboard/models/account.model';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateTransactionComponent } from '../create-transaction/create-transaction.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";


@Component({
  selector: 'app-list-transactions',
  imports: [
    DatePipe,
    CurrencyPipe,
    NegativeValuesPipe,
    MatCardTitle,
    MatCardHeader,
    MatCardModule,
    MatProgressSpinnerModule
],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.css',
})
export class ListTransactionsComponent {
  // private readonly transactionsService = inject(TransactionsService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private transactionsService = inject(TransactionsService);
  private readonly dialog = inject(MatDialog);

  @Output() editEmitter = new EventEmitter<string>();

  // transactions: Transaction[] = [];
  transactions = signal<Transaction[]>([]);
  transactionTypesEnum = TransactionTypes;
  
  account$ = this.dashboardService.account;

  loadingExt = signal(false)

  ngOnInit(): void {
    this.loadTransactions();
  }
  loadTransactions(): void {
    this.loadingExt.set(true)
    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loadingExt.set(false)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openCreateTransactionDialog(): void {
    this.dialog
      .open(CreateTransactionComponent, {
        width: '420px',
      })
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.loadTransactions();
        }
      });
  }

  redirectToCreate(): void {
    this.router.navigate(['/transacoes/criar']);
  }

  onEdit(id: string): void {
    this.router.navigate([`/transacoes/editar/${id}`]);
  }

  onDelete(id: string, amount: number): void {
    const transactionToDelete = this.transactions().find((t) => t.id === id);
    if (!transactionToDelete) {
      return;
    }

    this.dialog
      .open(ConfirmDeleteDialogComponent, {
        width: '420px',
        data: {
          description: transactionToDelete.description,
          id: transactionToDelete.id,
        },
      })
      .afterClosed()
      .pipe(first())
      .subscribe((confirmed) => {
        if (confirmed) {
          // this.transactionsService
          //   .deleteTransaction(id)
          //   .pipe(first())
          //   .subscribe({
          //     next: () => {
          //       this.transactions();
          //     },
          //     error: (err) => {
          //       console.log(err);
          //     },
          //   });
          amount = amount * -1;
          // this.account$()
          //   .pipe(take(1))
          //   .subscribe((account) => {
          //     const novoSaldo = +account!.balance + +amount;
          //     this.updateBalance(novoSaldo);
          // });
          const account = this.account$();
          if (!account) return;
          const novoSaldo = +account.balance + +amount;
          this.updateBalance(novoSaldo);
          this.loadTransactions();
        }
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
