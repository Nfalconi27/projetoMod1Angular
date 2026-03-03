
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../model/loan.model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  createLoan(loan: Loan): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/loans`, loan);
  }

}
