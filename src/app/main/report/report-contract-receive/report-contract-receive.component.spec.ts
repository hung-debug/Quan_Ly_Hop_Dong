import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportContractReceiveComponent } from './report-contract-receive.component';

describe('ReportContractReceiveComponent', () => {
  let component: ReportContractReceiveComponent;
  let fixture: ComponentFixture<ReportContractReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportContractReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportContractReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
