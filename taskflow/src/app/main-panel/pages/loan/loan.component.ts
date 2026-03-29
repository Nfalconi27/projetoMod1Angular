import { Component, inject, Input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Account } from '../dashboard/models/account.model';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-loan',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    CurrencyPipe,
    DecimalPipe,
    LoanSimulatorComponent,
    TranslateModule
  ],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css',
})
export class LoanComponent {
  loanLimit = signal(100000);
  loanInterest = signal(8.55);

  private readonly dashboardService = inject(DashboardService);

  // account$ = toSignal<Account | undefined>(this.dashboardService.getAccount(), {
  //   initialValue: undefined,
  // });
  account$ = this.dashboardService.account;

  @Input() id?: string;

  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
}
