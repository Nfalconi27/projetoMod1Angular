import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { finalize, first, switchMap } from 'rxjs';
import { Account } from '../dashboard/models/account.model';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { TransactionTypes } from '../transactions/constants/transaction-types.enum';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { Transfer } from './models/transfers.model';
import { TransfersService } from './services/transfers.service';

@Component({
  selector: 'app-transfer',
  imports: [ReactiveFormsModule, MatCardModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent {
  private readonly transactionsService = inject(TransactionsService);
  private readonly transferService = inject(TransfersService);
  private readonly dashboardService = inject(DashboardService);

  @Input() id?: string;

  // formTransfer!: FormGroup;
  transactionTypesEnum = TransactionTypes;
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;

  // account$ = toSignal<Account | undefined>(this.dashboardService.getAccount(), {
  //   initialValue: undefined,
  // });

  // account$ = this.dashboardService.account;
  loadingLoadAc = signal(true);

  account$ = toSignal<Account | undefined>(
    this.dashboardService
      .getAccount()
      .pipe(finalize(() => this.loadingLoadAc.set(false))),
    { initialValue: null },
  );

  isTransfering = signal(false);

  // ngOnInit(): void {
  //   this.buildForm();
  // }

  // buildForm(): void {
  formTransfer = new FormGroup({
    date: new FormControl(this.todayISO, {
      validators: [Validators.required],
      nonNullable: true,
    }),

    description: new FormControl<string>('', {
      validators: [Validators.minLength(3), Validators.maxLength(100)],
    }),

    amount: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),

    destAccount: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),

    type: new FormControl<TransactionTypes>(TransactionTypes.EXPENSE, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  // }

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.formTransfer.valid) return;

    const formValue = this.formTransfer.getRawValue();

    const payload: Omit<Transaction, 'id'> = {
      date: formValue.date,
      amount: formValue.amount!,
      type: formValue.type,
      ...(formValue.description && {description: formValue.description,})
    };

    const payload2: Omit<Transfer, 'id'> = {
      date: formValue.date,
      amount: formValue.amount!,
      destAccount: formValue.destAccount,
      ...(formValue.description && {description: formValue.description,})
    };

    // const { destAccount, ...payload } = formValue;
    // const { type, ...payload2 } = formValue;

    const account = this.account$();
    if (!account) {
      alert('Conta não encontrada!');
      return;
    }

    const novoSaldo = account.balance - Number(payload.amount);

    if (novoSaldo < 0) {
      alert('Saldo insuficiente!');
      return;
    }

    this.isTransfering.set(true);
    payload.amount = -Math.abs(Number(payload.amount));
    payload2.amount = -Math.abs(Number(payload2.amount));

    this.transactionsService
      .createTransaction(payload)
      .pipe(
        switchMap(() => this.transferService.createTransfer(payload2)),
        switchMap(() => this.dashboardService.updateBalance(novoSaldo)),
      )
      .subscribe({
        next: () => {
          alert('Operação concluída com sucesso!');
          this.formTransfer.reset();
        },
        error: (err) => {
          console.error(err);
          alert('Erro na operação');
        },
        complete: () => {
          this.isTransfering.set(false);
        },
      });
  }

  saveTransaction(payload: Transaction, payload2: Transfer): void {
    this.transactionsService
      .createTransaction(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          payload2.amount *= -1;
          this.saveTransfer(payload2);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  saveTransfer(payload2: Transfer): void {
    this.transferService
      .createTransfer(payload2)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          this.updateBalance(payload2.amount);
        },
        error: (err) => {
          console.log(err);
        },
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
        complete: () => {
          this.formTransfer.reset();
          this.isTransfering.set(false);
          alert('Operação concluída com sucesso!');
        },
      });
  }
}
