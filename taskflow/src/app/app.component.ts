import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardService } from './main-panel/pages/dashboard/services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  private readonly dashboardService = inject(DashboardService);

  account = toSignal(this.dashboardService.getAccount());

  ngOnInit() {
    this.dashboardService.loadAccount();
  }

  // ngOnInit() {
  //   this.dashboardService.getAccount().subscribe();
  // }
}
