import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Observable, tap, throwError } from 'rxjs';
import { Account } from '../models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:3000/account';
  private readonly http = inject(HttpClient);

  constructor(private snackBar: MatSnackBar) {}

  private _account = signal<Account | null>(null);
  account = this._account.asReadonly();

  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}`).pipe(
      catchError(() => {
        this.showError('Erro ao buscar conta');
        return EMPTY;
      }),
    );
  }

  loadAccount() {
    this.http
      // .get<Account>(`${this.apiUrl}/eqeqds`) // para testar erro
      .get<Account>(`${this.apiUrl}`)
      .pipe(
        catchError((err) => {
          this.showError('Erro ao carregar conta');
          return EMPTY;
        }),
      )
      .subscribe((acc) => {
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
          this.showError('Erro ao atualizar saldo');
          return EMPTY;
        }),
      );
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 6000 });
  }
}
