import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDataComponent } from './security-data.component';

describe('SecurityDataComponent', () => {
  let component: SecurityDataComponent;
  let fixture: ComponentFixture<SecurityDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
