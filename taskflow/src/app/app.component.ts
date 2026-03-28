import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardService } from './main-panel/pages/dashboard/services/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  private readonly dashboardService = inject(DashboardService);

  account = toSignal(this.dashboardService.getAccount());

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['pt-pt', 'pt-br']);
    this.translate.setFallbackLang(environment.defaultLang);
    this.translate.use(environment.defaultLang);
  }

  ngOnInit() {
    this.dashboardService.loadAccount();
  }

}
