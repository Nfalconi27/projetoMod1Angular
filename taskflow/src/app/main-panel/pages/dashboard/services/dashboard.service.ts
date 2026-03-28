import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:3000/account';
  private readonly http = inject(HttpClient);

  private _account = signal<Account | null>(null);
  account = this._account.asReadonly();

  getAccount(): Observable<Account> {
    return this.http
    .get<Account>(`${this.apiUrl}`)
    .pipe(
        catchError(() => this.http.get<Account>(`${this.apiUrl}/account/item`)),
      );
  }

  loadAccount() {
    this.http.get<Account>(this.apiUrl).subscribe((acc) => {
      this._account.set(acc);
    });
  }

  updateBalance(newBalance: number): Observable<Account> {
    return this.http
      .patch<Account>(this.apiUrl, {
        balance: newBalance,
      })
      .pipe(
        tap((updatedAccount) => {
          this._account.set(updatedAccount);
        }),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Erro ao atualizar o saldo!'));
        }),
      );
  }
}
