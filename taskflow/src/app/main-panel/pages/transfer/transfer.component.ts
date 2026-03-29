import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { first } from 'rxjs';
import { Account } from '../dashboard/models/account.model';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { TransactionTypes } from '../transactions/constants/transaction-types.enum';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { Transfer } from './models/transfers.model';
import { TransfersService } from './services/transfers.service';

@Component({
  selector: 'app-transfer',
  imports: [ReactiveFormsModule, MatCardModule, CurrencyPipe],
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
  account$ = this.dashboardService.account;
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

    description: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ],
      nonNullable: true,
    }),

    amount: new FormControl(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),

    destAccount: new FormControl(0, {
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
    const { destAccount, ...payload } = formValue;
    const { type, ...payload2 } = formValue;

    // payload.amount = Number(payload.amount);
    // payload2.amount = Number(payload2.amount);

    const account = this.account$();
    if (!account) {
      alert('Conta não encontrada!');
      return;
    }

    const novoSaldo = account.balance - payload.amount;

    if (novoSaldo < 0) {
      alert('Saldo insuficiente!');
      return;
    }

    this.isTransfering.set(true);
    payload.amount = -Math.abs(payload.amount);
    payload2.amount = -Math.abs(payload2.amount);

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
