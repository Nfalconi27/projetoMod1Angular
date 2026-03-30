import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { NegativeValuesPipe } from '../../../shared/pipes/negative-values.pipe';
import { Transaction } from '../transactions/models/transaction.model';
import { TransactionsService } from '../transactions/services/transactions.service';
import { CreditCardInvoiceComponent } from './components/credit-card-invoice/credit-card-invoice.component';
import { Account } from './models/account.model';
import { DashboardService } from './services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    NegativeValuesPipe,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    CreditCardInvoiceComponent,
    MatProgressSpinnerModule,
    TranslatePipe,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);
  private readonly transactionService = inject(TransactionsService);
  constructor(private snackBar: MatSnackBar) {}
  loadingLoadAc = signal(true);
  loadingTrans = signal(true);

  // ngOnInit() {
  //   this.dashboardService.loadAccount();
  //   this.loadingLoadAc.set(false)
  // }

  account = toSignal<Account | undefined>(
    this.dashboardService.getAccount().pipe(
      finalize(() => this.loadingLoadAc.set(false))
    ),
    { initialValue: null }
  );


  isBalanceVisible = signal(false);
  toggleBalanceVisibility() {
    this.isBalanceVisible.update((visible) => !visible);
  }

  // accountData = this.dashboardService.account;


  transactions = toSignal(this.transactionService.getTransactions().pipe(
    finalize(() => this.loadingTrans.set(false))
  ), { 
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
