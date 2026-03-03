import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardService } from './main-panel/pages/dashboard/services/dashboard.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  private readonly dashboardService = inject(DashboardService);

  ngOnInit() {
    this.dashboardService.getAccount().subscribe();
  }
}
