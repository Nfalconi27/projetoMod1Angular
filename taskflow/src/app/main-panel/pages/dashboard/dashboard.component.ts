import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NegativeValuesPipe } from '../../../shared/pipes/negative-values.pipe';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CreditCardInvoiceComponent } from "./components/credit-card-invoice/credit-card-invoice.component";
import { DashboardService } from './services/dashboard.service';
import { Account } from './models/account.model';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, NegativeValuesPipe, CurrencyPipe, DatePipe, MatIconModule, MatButton, CreditCardInvoiceComponent, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionService = inject(TransactionsService);
  // constructor(private transactionService: TransactionsService) {}

  // account?: Account;
  transactions: Transaction[] = [];
  totalEntradasMes = 0;
  totalDespesasMes = 0;
  ultimasTransacoes: Transaction[] = [];

  isBalanceVisible = signal(false);
  toggleBalanceVisibility() {
    this.isBalanceVisible.update((visible) => !visible);
  } 

  accountData = toSignal<Account | undefined>(this.dashboardService.getAccount(), {initialValue: undefined})
  
  

  ngOnInit(): void {
    this.getLastTransactions();
  }

  getLastTransactions() {
    const hoje = new Date();

    this.transactionService.getTransactions().subscribe((res) => {
      this.transactions = res;

      const receitas = this.transactions.filter((t) => {
        const dataT = new Date(t.date);
        return (
          t.type === 'income' &&
          dataT.getMonth() === hoje.getMonth() &&
          dataT.getFullYear() === hoje.getFullYear()
        );
      });

      this.totalEntradasMes = receitas.reduce(
        (total, t) => +total + +t.amount,
        0,
      );

      const despesas = this.transactions.filter((t) => {
        const dataT = new Date(t.date);
        return (
          t.type === 'expense' &&
          dataT.getMonth() === hoje.getMonth() &&
          dataT.getFullYear() === hoje.getFullYear()
        );
      });

      this.totalDespesasMes = despesas.reduce(
        (total, t) => +total + +t.amount,
        0,
      );

      this.ultimasTransacoes = this.transactions
        .sort((a, b) => {
          const dataA = new Date(a.date).getTime();
          const dataB = new Date(b.date).getTime();

          return dataB - dataA; // mais recente primeiro
        })
        .slice(0, 8);
    });
  }
}
