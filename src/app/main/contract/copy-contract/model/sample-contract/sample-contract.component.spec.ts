import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleContractComponent } from './sample-contract.component';

describe('SampleContractComponent', () => {
  let component: SampleContractComponent;
  let fixture: ComponentFixture<SampleContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
