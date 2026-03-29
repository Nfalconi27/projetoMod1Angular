import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000/transactions';
  private readonly http = inject(HttpClient);

  constructor(private snackBar: MatSnackBar) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`).pipe(
      map((transactions) =>
        transactions.sort((a, b) => {
          const dataA = new Date(a.date).getTime();
          const dataB = new Date(b.date).getTime();
          return dataB - dataA; // mais recente primeiro
        }),
      ),
      catchError((err) => {
        this.showError('Erro ao buscar extrato');
        return EMPTY;
      }),
    );
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        this.showError('Erro ao buscar transação');
        return EMPTY;
      }),
    );
  }

  createTransaction(
    transaction: Omit<Transaction, 'id'>,
  ): Observable<Transaction> {
    // const headers = new HttpHeaders({
    //   Authorization: 'Bearer token-secreto-banco-123' ,
    //   'Content-Type': 'application/json'
    // });
    //POST: precisa da url, corpo da req e das opções(headers)
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction).pipe(
      catchError((err) => {
        this.showError('Erro ao criar transação');
        return EMPTY;
      }),
    );
  }

  updateTransaction(transaction: Transaction, id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, transaction).pipe(
      catchError((err) => {
        this.showError('Erro ao atualizar transação');
        return EMPTY;
      }),
    );
  }

  deleteTransaction(id: string): Observable<void> {
    const params = new HttpParams().set('motivo', 'cancelamento');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params }).pipe(
      catchError((err) => {
        this.showError('Erro ao excluir transação');
        return EMPTY;
      }),
    );
  }
  private showError(message: string) {
    this.snackBar.open(message, 'Fechar', { duration: 6000 });
  }
}
