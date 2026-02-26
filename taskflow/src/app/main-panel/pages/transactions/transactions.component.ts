import { Component, inject } from '@angular/core';
import { CreateTransactionComponent } from './components/create-transaction/create-transaction.component';
import { ListTransactionsComponent } from './components/list-transactions/list-transactions.component';
import { RouterService } from '../../../core/services/router.service';
import { TransactionPagesEnum } from './constants/transaction-pages.enum';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [CreateTransactionComponent, ListTransactionsComponent, AsyncPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  // private readonly destroyRef = inject(DestroyRef);
  // obs = new Observable((observer) => {
  //   let count = 0;
  //   setInterval(() => {
  //     observer.next(count);
  //     count++;
  //   }, 1000);
  // });
  // ngOnInit(): void {
  //   this.obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //     complete: () => {
  //       console.log('Finalizou');
  //     },
  //   });
  // }

  private readonly routerService = inject(RouterService);

  id?: string;

  page$ = this.routerService.getTransactionPage();
  pagesEnum = TransactionPagesEnum;

  handleEditTransaction(id: string): void {
    this.id = id;
    this.routerService.setTransactionPage(TransactionPagesEnum.EDIT);
  }
}
