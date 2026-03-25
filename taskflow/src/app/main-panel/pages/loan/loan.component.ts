import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, take } from 'rxjs';
import { TransactionTypes } from '../transactions/constants/transaction-types.enum';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { LoanService } from './services/loan.service';
import { Loan } from './model/loan.model';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-loan',
  imports: [ReactiveFormsModule,MatCardModule,CurrencyPipe, AsyncPipe, MatChipsModule],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent implements OnInit{
  private readonly loanService = inject(LoanService);
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionsService = inject(TransactionsService);

  @Input() id?: string;

  formCred!: FormGroup;
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
  account$ = this.dashboardService.account$;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.formCred = new FormGroup({
      date: new FormControl(this.todayISO),
      amount: new FormControl(null, Validators.required),
      description: new FormControl("Crédito Empréstimo"),
      parcelas: new FormControl("1", Validators.required),
      valorParcela: new FormControl({ value: 0, disabled: true }),
      valorTotal: new FormControl({ value: 0, disabled: true }),
      type: new FormControl("income")
    });
    this.listenFormChanges();
  }
  
  listenFormChanges(): void {
    this.formCred.valueChanges.subscribe(values => {

      const valor = values.amount;
      const parcelas = Number(values.parcelas);

      if (!valor || !parcelas) return;

      const valorParcela = valor * (0.0855 * Math.pow(1 + 0.0855, parcelas)) /
    (Math.pow(1 + 0.0855, parcelas) - 1);;
      const valorTotal = valorParcela * parcelas;

      this.formCred.patchValue(
        {
          valorParcela: valorParcela.toFixed(2),
          valorTotal: valorTotal.toFixed(2),
        },
        { emitEvent: false }
      );
    });
  }

  parseCurrency(value: string): number {
    if (!value) return 0;

    return Number(
      value
        .replace('.', '')
        .replace(',', '.')
    );
  }

  onSubmit(): void {
    const formValue = this.formCred.getRawValue();
    let { valorParcela, valorTotal, ...payload } = formValue;
    let {parcelas, ...payload2 } = formValue;
   
    this.account$
        .pipe(take(1))
        .subscribe(account => {
          this.createLoan(payload)
          this.saveTransaction(payload2)
          const novoSaldo = +account!.balance + +payload.amount;
          this.updateBalance(novoSaldo) 
          this.formCred.reset()
          alert("Operação concluída com sucesso!")   
        })
  }

  createLoan(payload: Loan): void {
    this.loanService
      .createLoan(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso1!');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  saveTransaction(payload: Transaction): void {
    this.transactionsService
      .createTransaction(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso2!');
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
      });
  }

}
