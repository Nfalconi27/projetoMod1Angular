import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private router: Router) { }

  login(email: string, password: string): boolean {
    if (email === 'mariana@nf.com' && password === 'mariana123') {
      const fakeJwt = 'KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30.falso-payload.falsa-assinatura';
      localStorage.setItem('token', fakeJwt);
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
