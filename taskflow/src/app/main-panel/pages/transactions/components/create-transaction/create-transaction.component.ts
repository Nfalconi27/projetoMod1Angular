import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { first, map, switchMap, take } from 'rxjs';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-transaction',
  imports: [ReactiveFormsModule, MatCardModule, AsyncPipe, CurrencyPipe],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @Input() id?: string;

  form!: FormGroup;
  transactionTypesEnum = TransactionTypes;
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
  account$ = this.dashboardService.account$;

  ngOnInit(): void {
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.id) {
      this.getTransactionById();
    }
  }

  buildForm(): void {
    this.form = new FormGroup({
      date: new FormControl(this.todayISO),
      description: new FormControl(null,[Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      amount: new FormControl(null,Validators.required),
      type: new FormControl(null,Validators.required),
    });
  }

  getTransactionById(): void {
    this.transactionsService
      .getTransactionById(this.id!)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.form.patchValue(transaction);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSubmit(): void {
    const payload: Transaction = this.form.getRawValue();
    payload.amount =
      (payload.type === TransactionTypes.EXPENSE ? -1 : 1) * payload.amount;
    
    if (this.id) {
      this.account$
      .pipe(
        take(1),
        switchMap(account =>
          this.transactionsService.getTransactionById(this.id!).pipe(
            take(1),
            map(transaction => ({
              account,
              transaction
            }))
          )
        )
      )
      .subscribe(({ account, transaction }) => {
        let novoSaldo = +account!.balance - +transaction.amount;        
        this.updateTransaction(payload)
        novoSaldo += +payload.amount;        
        this.updateBalance(novoSaldo);
      });        
      
    } else {
      this.account$
      .pipe(take(1))
      .subscribe(account => {
        const novoSaldo = +account!.balance + +payload.amount;
        if (novoSaldo<0) {
          alert('Saldo insuficiente!');
          return;
        }      
        this.saveTransaction(payload)
        this.updateBalance(novoSaldo);
        this.backToList()
      });
    }  
  }

  saveTransaction(payload: Transaction): void {
    this.transactionsService
      .createTransaction(payload)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          this.backToList();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  updateTransaction(payload: Transaction): void {
    this.transactionsService
      .updateTransaction(payload, this.id!)
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Sucesso!');
          this.backToList();
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
          this.backToList();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  backToList(): void {
    this.router.navigate(['/transacoes']);
  }
}
