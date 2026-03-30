import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { finalize, first, Observable, switchMap, take } from 'rxjs';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { Transaction } from '../../../transactions/models/transaction.model';
import { TransactionsService } from '../../../transactions/services/transactions.service';
import { Loan } from '../../model/loan.model';
import { LoanService } from '../../services/loan.service';
import { Account } from '../../../dashboard/models/account.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-loan-simulator',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    CurrencyPipe,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loan-simulator.component.html',
  styleUrl: './loan-simulator.component.css',
})
export class LoanSimulatorComponent {
  private readonly loanService = inject(LoanService);
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionsService = inject(TransactionsService);

  formCred!: FormGroup;

  @Input() id?: string;

  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;

  account$ = this.dashboardService.account;
  loadingLoadAc = signal(true);

  ngOnInit(): void {
    // this.dashboardService.loadAccount();
    this.buildForm();
  }

  account = toSignal<Account | undefined>(
    this.dashboardService.getAccount().pipe(
      finalize(() => this.loadingLoadAc.set(false))
    ),
    { initialValue: null }
  );

  buildForm(): void {
    this.formCred = new FormGroup({
      date: new FormControl(this.todayISO),
      amount: new FormControl(null, Validators.required),
      description: new FormControl('Crédito Empréstimo'),
      parcelas: new FormControl('1', Validators.required),
      valorParcela: new FormControl({ value: 0, disabled: true }),
      valorTotal: new FormControl({ value: 0, disabled: true }),
      type: new FormControl('income'),
    });
    this.listenFormChanges();
  }

  listenFormChanges(): void {
    this.formCred.valueChanges.subscribe((values) => {
      const valor = values.amount;
      const parcelas = Number(values.parcelas);

      if (!valor || !parcelas) return;

      const valorParcela =
        (valor * (0.0855 * Math.pow(1 + 0.0855, parcelas))) /
        (Math.pow(1 + 0.0855, parcelas) - 1);
      const valorTotal = valorParcela * parcelas;

      this.formCred.patchValue(
        {
          valorParcela: valorParcela.toFixed(2),
          valorTotal: valorTotal.toFixed(2),
        },
        { emitEvent: false },
      );
    });
  }

  parseCurrency(value: string): number {
    if (!value) return 0;

    return Number(value.replace('.', '').replace(',', '.'));
  }

  loadingEmpr = signal(false);

  onSubmit(): void {
    const formValue = this.formCred.getRawValue();
    let { valorParcela, valorTotal, ...payload } = formValue;
    let { parcelas, ...payload2 } = formValue;

    const account = this.account$();
    if (!account) return;
    const novoSaldo = +account!.balance + +payload.amount;

    this.loadingEmpr.set(true);

    this.loanService
      .createLoan(payload)
      .pipe(
        switchMap(() => this.transactionsService.createTransaction(payload2)),
        switchMap(() => this.dashboardService.updateBalance(novoSaldo)),
        finalize(() => this.loadingEmpr.set(false)),
      )
      .subscribe({
        next: () => {
          this.formCred.reset();
          alert('Operação concluída com sucesso!');
        },
        error: () => {
          alert('Erro ao realizar operação');
        },
      });
    // this.loadingEmpr.set(true)
    // this.createLoan(payload);
    // this.saveTransaction(payload2);
    // this.updateBalance(novoSaldo);
    // this.formCred.reset();
    // alert('Operação concluída com sucesso!');
  }

  // createLoan(payload: Loan): void {
  //   this.loanService
  //     .createLoan(payload)
  //     .pipe(first())
  //     .subscribe({
  //       next: () => {
  //         console.log('Sucesso1!');
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  // }
  // saveTransaction(payload: Transaction): void {
  //   this.transactionsService
  //     .createTransaction(payload)
  //     .pipe(first())
  //     .subscribe({
  //       next: () => {
  //         console.log('Sucesso2!');
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  // }
  // updateBalance(balance: number): void {
  //   this.dashboardService
  //     .updateBalance(balance)
  //     .pipe(first())
  //     .subscribe({
  //       next: () => {
  //         console.log('Saldo Atualizado!');
  //       },
  //       error: (err) => {
  //         console.log(err);
  //       },
  //     });
  // }
}
