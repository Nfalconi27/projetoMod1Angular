import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { Account } from '../dashboard/models/account.model';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';

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
    TranslateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanComponent {
  loanLimit = signal(100000);
  loanInterest = signal(8.55);

  private readonly dashboardService = inject(DashboardService);

  loadingLoadAc = signal(true);

  @Input() id?: string;

  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
}
