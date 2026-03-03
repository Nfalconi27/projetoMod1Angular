import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, switchMap, tap } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  private accountSubject = new BehaviorSubject<Account | null>(null);

  account$ = this.accountSubject.asObservable();

  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/account`)
    .pipe(
        tap(account => this.accountSubject.next(account))
      );
  }

  updateBalance(newBalance: number): Observable<Account> {
    return this.http.patch<Account>(
    `${this.apiUrl}/account/`,
    { balance: newBalance }
  ).pipe(
    tap(updatedAccount => {
      this.accountSubject.next(updatedAccount);
    })
  );
}

}
