import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardInvoiceComponent } from './credit-card-invoice.component';

describe('CreditCardInvoiceComponent', () => {
  let component: CreditCardInvoiceComponent;
  let fixture: ComponentFixture<CreditCardInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
