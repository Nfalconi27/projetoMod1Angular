import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Loan } from '../model/loan.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly http = inject(HttpClient);
  constructor(private snackBar: MatSnackBar) {}

  apiUrl = 'http://localhost:3000';

  private _loanLimit = signal(100000);
  loanLimit = this._loanLimit.asReadonly();
  deduct(value: number) {
    if(this._loanLimit() >= value){
      this._loanLimit.update(current => current - value);
    } else {
      this.showError('Limite excedido')
    }
  }
  set(value: number) {
    this._loanLimit.set(value);
  }

  createLoan(loan: Loan): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/loans`, loan).pipe(
      catchError((err) => {
        this.showError('Erro ao fazer empréstimo');
        return EMPTY;
      }),
    );
  }
  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 6000 });
  }
}
