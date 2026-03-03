import { MatCardModule } from "@angular/material/card";
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first, take } from 'rxjs';
import { TransactionTypes } from '../transactions/constants/transaction-types.enum';
import { TransactionsService } from '../transactions/services/transactions.service';
import { Transaction } from '../transactions/models/transaction.model';
import { TransfersService } from "./services/transfers.service";  
import { Transfer } from "./models/transfers.model";
import { CurrencyPipe, AsyncPipe } from '@angular/common';
import { DashboardService } from "../dashboard/services/dashboard.service";


@Component({
  selector: 'app-transfer',
  imports: [ReactiveFormsModule, MatCardModule, AsyncPipe, CurrencyPipe],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly transferService = inject(TransfersService);
  private readonly dashboardService = inject(DashboardService);

  @Input() id?: string;

  formTransfer!: FormGroup;
  transactionTypesEnum = TransactionTypes;
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
  account$ = this.dashboardService.account$;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {

    this.formTransfer = new FormGroup({
      date: new FormControl(this.todayISO),
      description: new FormControl(null,[Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      amount: new FormControl(null,Validators.required),
      destAccount: new FormControl(null,Validators.required),
      type: new FormControl("expense"),
    });
  }

  onSubmit(): void {
    const { destAccount, ...payload } = this.formTransfer.getRawValue();
    const {type, ...payload2} = this.formTransfer.getRawValue();
    
    payload.amount = -1 * payload.amount;

    this.account$
    .pipe(take(1))
    .subscribe(account => {
      const novoSaldo = +account!.balance + +payload.amount;
      if (novoSaldo<0) {
        alert('Saldo insuficiente!');
        return;
      }
      this.saveTransaction(payload)
      payload.amount *= (-1)
      this.saveTransfer(payload2)
      this.updateBalance(novoSaldo)
      this.formTransfer.reset()
      alert("Operação concluída com sucesso!")       
      });
  }

  saveTransfer(payload: Transfer): void {
    this.transferService
      .createTransfer(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
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
          console.log('Sucesso!');
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