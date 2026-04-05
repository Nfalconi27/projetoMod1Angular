import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { Account } from '../../../dashboard/models/account.model';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-create-transaction',
  imports: [ReactiveFormsModule, MatCardModule, CurrencyPipe],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent {
  private readonly transactionsService = inject(TransactionsService);
  private readonly dialogRef = inject(MatDialogRef<CreateTransactionComponent>);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  readonly data = inject<Partial<Transaction>>(MAT_DIALOG_DATA, {
    optional: true,
  });

  //   ngOnInit() {
  //   if (this.data) {
  //     this.transactionForm.patchValue(this.data);
  //   }
  // }

  account$ = toSignal<Account | undefined>(this.dashboardService.getAccount(), {
    initialValue: undefined,
  });

  transactionForm = new FormGroup({
    date: new FormControl(
      this.data?.date ?? new Date().toISOString().split('T')[0],
      {
        validators: Validators.required,
        nonNullable: true,
      },
    ),
    description: new FormControl<string>('', {
      validators: [Validators.minLength(3), Validators.maxLength(100)],
    }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    type: new FormControl<TransactionTypes | null>(this.data?.type ?? null, {
      validators: Validators.required,
    }),
  });

  transactionTypesEnum = TransactionTypes;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const formValue = this.transactionForm.getRawValue();

      const payload: Omit<Transaction, 'id'> = {
        date: formValue.date,
        type: formValue.type!,
        amount: formValue.type === TransactionTypes.EXPENSE
            ? -Math.abs(formValue.amount!)
            : Math.abs(formValue.amount!),
        ...(formValue.description && { description: formValue.description }),
      };

      // const payload: Omit<Transaction, 'id'> = {
      //   ...formValue,
      //   amount:
      //     formValue.type === TransactionTypes.EXPENSE
      //       ? -Math.abs(formValue.amount)
      //       : Math.abs(formValue.amount),
      //   type: formValue.type!,
      // };

      const account = this.account$();
      if (!account) return;

      const novoSaldo = +account.balance + +payload.amount;

      if (this.data) {
        const payload2: Transaction = {
          id: this.data?.id!,
          ...payload,
        };
        const novoSaldo2 =
          +account.balance - this.data?.amount! + payload2.amount;
        this.transactionsService
          .updateTransaction(payload2, this.data?.id!)
          .pipe(
            switchMap(() => this.dashboardService.updateBalance(novoSaldo2)),
          )
          .subscribe({
            next: () => {
              alert('Transação feita com sucesso!');
              this.transactionForm.reset();
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error(err);
              this.errorMessage.set('Erro na operação');
            },
            complete: () => {
              this.isLoading.set(false);
            },
          });
      } else {
        this.transactionsService
          .createTransaction(payload)
          .pipe(switchMap(() => this.dashboardService.updateBalance(novoSaldo)))
          .subscribe({
            next: () => {
              alert('Transação feita com sucesso!');
              this.transactionForm.reset();
              this.dialogRef.close(true);
            },
            error: (err) => {
              console.error(err);
              this.errorMessage.set('Erro na operação');
            },
            complete: () => {
              this.isLoading.set(false);
            },
          });
      }
    }
  }

  backToList(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/transacoes']);
  }
}
