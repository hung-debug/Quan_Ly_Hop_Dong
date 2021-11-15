import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsiderContractComponent } from './consider-contract.component';

describe('ConsiderContractComponent', () => {
  let component: ConsiderContractComponent;
  let fixture: ComponentFixture<ConsiderContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsiderContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsiderContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
