import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { NegativeValuesPipe } from '../../../shared/pipes/negative-values.pipe';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CreditCardInvoiceComponent } from './components/credit-card-invoice/credit-card-invoice.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    NegativeValuesPipe,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatButton,
    CreditCardInvoiceComponent,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionService = inject(TransactionsService);

  isBalanceVisible = signal(false);
  toggleBalanceVisibility() {
    this.isBalanceVisible.update((visible) => !visible);
  }

  // accountData = toSignal<Account | undefined>(
  //   this.dashboardService.getAccount(),
  //   { initialValue: undefined },
  // );
  accountData = this.dashboardService.account;


  transactions = toSignal(this.transactionService.getTransactions(), { 
    initialValue: [] as Transaction[]
  });

  receitas = computed(() => {
    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    return this.transactions().filter(t => {
      const d = new Date(t.date);
      return t.type === 'income' &&
            d.getMonth() === mes &&
            d.getFullYear() === ano;
    });
  });
  totalEntradasMes = computed(() =>
    this.receitas().reduce((total, t) => total + +t.amount, 0)
  );

  despesas = computed(() => {
    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    return this.transactions().filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' &&
            d.getMonth() === mes &&
            d.getFullYear() === ano;
    });
  });

  totalDespesasMes = computed(() =>
    this.despesas().reduce((total, t) => total + +t.amount, 0)
  );

  ultimasTransacoes = computed(() =>
    [...this.transactions()]
      .sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 16)
  );

  // }
}
