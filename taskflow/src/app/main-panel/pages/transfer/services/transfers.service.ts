import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { Transfer } from '../models/transfers.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TransfersService {
  private readonly http = inject(HttpClient);

  constructor(private snackBar: MatSnackBar) {}

  apiUrl = 'http://localhost:3000';

  getTransfers(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.apiUrl}/transfers`).pipe(
      catchError((err) => {
        this.showError('Erro ao buscar transferências');
        return EMPTY;
      }),
    );
  }

  // createTransfer(transfer: Transfer): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/transfers`, transfer);
  // }

  createTransfer(transfer: Omit<Transfer, 'id'>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfers`, transfer).pipe(
      catchError((err) => {
        this.showError('Erro ao fazer transferência');
        return EMPTY;
      }),
    );
  }
  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 6000 });
  }
}
