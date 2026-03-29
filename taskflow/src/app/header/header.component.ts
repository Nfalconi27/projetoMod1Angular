import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from '../core/services/auth.service';
import { DashboardService } from '../main-panel/pages/dashboard/services/dashboard.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatDividerModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  accountData = this.dashboardService.account;

  constructor(private readonly translate: TranslateService) {}
  
  mudarIdioma(idioma: string) {
    this.translate.use(idioma);
  }


  logout() {
    this.authService.logout();
  }


}
