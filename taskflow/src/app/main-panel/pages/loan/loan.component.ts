import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from '@angular/material/chips';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { LoanSimulatorComponent } from './components/loan-simulator/loan-simulator.component';

@Component({
  selector: 'app-loan',
  imports: [ReactiveFormsModule, MatCardModule, LoanSimulatorComponent, CurrencyPipe, AsyncPipe, DecimalPipe, MatChipsModule, MatButton],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css'
})
export class LoanComponent{
  loanLimit = signal(100000);
  loanInterest = signal(8.55);

  private readonly dashboardService = inject(DashboardService);

  @Input() id?: string;

  todayLocale = new Date().toLocaleDateString().split('/');
  todayISO = `${this.todayLocale[2]}-${this.todayLocale[1]}-${this.todayLocale[0]}`;
  account$ = this.dashboardService.account$;

}
