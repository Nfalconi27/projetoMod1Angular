import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe, switchMap, tap } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl = 'http://localhost:3000/account';
  constructor(private http: HttpClient) {}

  private accountSubject = new BehaviorSubject<Account | null>(null);

  account$ = this.accountSubject.asObservable();

  getAccount(): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}`)
  }

  updateBalance(newBalance: number): Observable<Account> {
    return this.http.patch<Account>(
    `${this.apiUrl}`,
    { balance: newBalance }
  ).pipe(
    tap(updatedAccount => {
      this.accountSubject.next(updatedAccount);
    })
  );
}

}
