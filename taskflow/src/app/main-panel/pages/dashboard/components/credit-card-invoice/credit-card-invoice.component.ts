import { Component,ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-card-invoice',
  imports: [MatButtonModule, TranslateModule],
  templateUrl: './credit-card-invoice.component.html',
  styleUrl: './credit-card-invoice.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditCardInvoiceComponent {

}
