import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transfer } from '../models/transfers.model';

@Injectable({
  providedIn: 'root',
})
export class TransfersService {
  private readonly http = inject(HttpClient);

  apiUrl = 'http://localhost:3000';

  getTransfers(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.apiUrl}/transfers`);
  }

  // createTransfer(transfer: Transfer): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/transfers`, transfer);
  // }

  createTransfer(transfer: Omit<Transfer, 'id'>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfers`, transfer);
  }
}
