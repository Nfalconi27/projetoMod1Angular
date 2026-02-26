import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs';
import { TransactionTypes } from '../../constants/transaction-types.enum';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction } from '../../models/transaction.model';
import { TransactionPagesEnum } from '../../constants/transaction-pages.enum';
import { RouterService } from '../../../../../core/services/router.service';

@Component({
  selector: 'app-create-transaction',
  imports: [ReactiveFormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent implements OnInit {
  private readonly transactionsService = inject(TransactionsService);
  private readonly routerService = inject(RouterService);

  @Input() id?: string;

  form!: FormGroup;
  transactionTypesEnum = TransactionTypes;
  // today = new Date().toISOString().substring(0, 10);
  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;

  ngOnInit(): void {
    this.buildForm();

    if (this.id) {
      this.getTransactionById();
    }
  }

  buildForm(): void {
    this.form = new FormGroup({
      date: new FormControl(this.todayISO),
      description: new FormControl(),
      amount: new FormControl(),
      type: new FormControl(),
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
      this.updateTransaction(payload);
      return;
    }

    this.saveTransaction(payload);
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

  backToList(): void {
    this.routerService.setTransactionPage(TransactionPagesEnum.LIST);
  }
}
