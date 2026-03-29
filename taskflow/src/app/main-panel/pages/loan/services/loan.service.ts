import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
