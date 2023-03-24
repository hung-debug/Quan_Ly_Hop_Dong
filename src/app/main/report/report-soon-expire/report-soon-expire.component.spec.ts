import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSoonExpireComponent } from './report-soon-expire.component';

describe('ReportSoonExpireComponent', () => {
  let component: ReportSoonExpireComponent;
  let fixture: ComponentFixture<ReportSoonExpireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSoonExpireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSoonExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
