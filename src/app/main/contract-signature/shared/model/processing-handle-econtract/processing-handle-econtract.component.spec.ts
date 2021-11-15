import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingHandleEcontractComponent } from './processing-handle-econtract.component';

describe('ProcessingHandleEcontractComponent', () => {
  let component: ProcessingHandleEcontractComponent;
  let fixture: ComponentFixture<ProcessingHandleEcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingHandleEcontractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingHandleEcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
