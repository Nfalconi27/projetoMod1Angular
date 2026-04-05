import { Component } from '@angular/core';
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-security-data',
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './security-data.component.html',
  styleUrl: './security-data.component.css'
})
export class SecurityDataComponent {

  security = {
    lastLogin: '05/04/2026 10:32',
    twoFactor: true,
  };

  changePassword() {
    alert('Senha alterada (mock)');
  }

  toggle2FA() {
    this.security.twoFactor = !this.security.twoFactor;
  }
}

