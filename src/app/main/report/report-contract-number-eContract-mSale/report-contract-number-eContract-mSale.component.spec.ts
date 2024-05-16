import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContractNumberEcontractMsaleComponent } from './report-contract-number-eContract-mSale.component';

describe('ReportSoonExpireComponent', () => {
  let component: ReportContractNumberEcontractMsaleComponent;
  let fixture: ComponentFixture<ReportContractNumberEcontractMsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportContractNumberEcontractMsaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportContractNumberEcontractMsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
