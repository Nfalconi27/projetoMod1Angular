import { Component } from '@angular/core';
import { ListTransactionsComponent } from './components/list-transactions/list-transactions.component';

@Component({
  selector: 'app-transactions',
  imports: [ListTransactionsComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
}
