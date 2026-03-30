import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../core/services/auth.service';
import { DashboardService } from '../main-panel/pages/dashboard/services/dashboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Account } from '../main-panel/pages/dashboard/models/account.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule,
    CurrencyPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  // accountData = this.dashboardService.account;

  // accountData = toSignal<Account | undefined>(
  //   this.dashboardService
  //     .getAccount()
  //     .pipe(finalize(() => this.loadingLoadAc.set(false))),
  //   { initialValue: null },

  // );

  // accountData = toSignal(this.dashboardService.account, {
  //   initialValue: null,
  // });

  accountData = this.dashboardService.account;
  loadingLoadAc = this.dashboardService.loadingConta;

  constructor(private readonly translate: TranslateService) {}

  mudarIdioma(idioma: string) {
    this.translate.use(idioma);
  }

  logout() {
    this.authService.logout();
  }
}
