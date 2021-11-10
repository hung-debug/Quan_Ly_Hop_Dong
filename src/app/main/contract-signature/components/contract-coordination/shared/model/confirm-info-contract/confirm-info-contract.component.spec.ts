import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInfoContractComponent } from './confirm-info-contract.component';

describe('ConfirmInfoContractComponent', () => {
  let component: ConfirmInfoContractComponent;
  let fixture: ComponentFixture<ConfirmInfoContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInfoContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInfoContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
