import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000/transactions';
  private readonly http = inject(HttpClient);

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}`);
  }

  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    const headers = new HttpHeaders({ 
      Authorization: 'Bearer token-secreto-banco-123' ,
      'Content-Type': 'application/json'
    });
    //POST: precisa da url, corpo da req e das opções(headers)
    return this.http.post<Transaction>(`${this.apiUrl}`, transaction, { headers });
  }

  updateTransaction(transaction: Transaction, id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: string): Observable<void> {
    const params = new HttpParams().set('motivo','cancelamento');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }
}
