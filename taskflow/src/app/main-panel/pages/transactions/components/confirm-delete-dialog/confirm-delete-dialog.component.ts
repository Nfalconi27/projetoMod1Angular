import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsService } from '../../services/transactions.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { switchMap } from 'rxjs';

interface ConfirmDeleteDialogData {
  id: string;
  amount: number;
  type: string;
  description: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  standalone: true,
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.css',
})
export class ConfirmDeleteDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<ConfirmDeleteDialogComponent, boolean>,
  );
  private readonly transactionService = inject(TransactionsService);
  readonly data = inject<ConfirmDeleteDialogData>(MAT_DIALOG_DATA);
  private readonly dashboardService = inject(DashboardService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  accountData = this.dashboardService.account;
  saldoTotal = 0;

  constructor() {
    effect(
      () => {
        const acc = this.accountData();
        if (!acc) return;

        this.saldoTotal = acc.balance - this.data.amount;
      },
      { allowSignalWrites: true },
    );
  }

  confirmDelete(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.transactionService.deleteTransaction(this.data.id)
    .pipe(
      switchMap(() =>
        this.dashboardService.updateBalance(this.saldoTotal)
      )
    )
    .subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.errorMessage.set('Ocorreu um erro ao tentar excluir a transação.');
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  close(confirm?: boolean): void {
    this.dialogRef.close(confirm);
  }
}
