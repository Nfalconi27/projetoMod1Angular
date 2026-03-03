import { Component, inject } from '@angular/core';
import { Pages } from '../constants/pages.enum';
import { RouterService } from '../core/services/router.service';
import { MenuItem } from '../models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly routerService = inject(RouterService);

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '',
      page: Pages.DASHBOARD,
      selected: true,
    },
    {
      label: 'Extrato',
      icon: '',
      page: Pages.TRANSACTIONS,
      selected: false,
    },
    {
      label: 'Transferência',
      icon: '',
      page: Pages.TRANSFER,
      selected: false,
    },
    {
      label: 'Crédito',
      icon: '',
      page: Pages.LOAN,
      selected: false,
    },
  ];

  redirectToPage(page: Pages): void {
    this.routerService.setCurrentPage(page);
  }

  /*
    Comunicação entre components
      DO .ts para o template
        Interpolação de string {{}
      Pai pra filho
        Property Binding []
      Filho para pai
        Event binding ()
      Pai para filho e filho para pai, ao mesmo tempo
        Two way binding [()]
      Comunicação entre componentes irmãos
        Estado centralizado (services ou ngrx)
  */
}
