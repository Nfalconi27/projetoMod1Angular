import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from '../core/services/auth.service';
import { DashboardService } from '../main-panel/pages/dashboard/services/dashboard.service';
@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  accountData = this.dashboardService.account;
  
  logout() {
    this.authService.logout();
  }


}
