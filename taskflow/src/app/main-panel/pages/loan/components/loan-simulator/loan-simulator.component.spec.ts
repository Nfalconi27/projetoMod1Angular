import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorComponent } from './loan-simulator.component';

describe('LoanSimulatorComponent', () => {
  let component: LoanSimulatorComponent;
  let fixture: ComponentFixture<LoanSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
