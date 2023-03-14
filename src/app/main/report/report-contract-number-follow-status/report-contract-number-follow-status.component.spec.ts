import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContractNumberFollowStatusComponent } from './report-contract-number-follow-status.component';

describe('ReportContractNumberFollowStatusComponent', () => {
  let component: ReportContractNumberFollowStatusComponent;
  let fixture: ComponentFixture<ReportContractNumberFollowStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportContractNumberFollowStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportContractNumberFollowStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
