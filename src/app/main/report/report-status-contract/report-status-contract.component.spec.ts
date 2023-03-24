import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStatusContractComponent } from './report-status-contract.component';

describe('ReportStatusContractComponent', () => {
  let component: ReportStatusContractComponent;
  let fixture: ComponentFixture<ReportStatusContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportStatusContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStatusContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
