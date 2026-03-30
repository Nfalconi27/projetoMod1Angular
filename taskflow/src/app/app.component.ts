import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { HeaderComponent } from './header/header.component';
import { MainPanelComponent } from './main-panel/main-panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, SidebarComponent, MainPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['pt-pt', 'pt-br']);
    this.translate.setFallbackLang(environment.defaultLang);
    const browserLang = this.translate.getBrowserCultureLang();
    this.translate.use(
      browserLang?.match(/pt-pt|pt-br/) ? browserLang : environment.defaultLang,
    );
  }
}
