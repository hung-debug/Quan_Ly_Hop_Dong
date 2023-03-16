import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNumberFollowTypeComponent } from './contract-number-follow-type.component';

describe('ContractNumberFollowTypeComponent', () => {
  let component: ContractNumberFollowTypeComponent;
  let fixture: ComponentFixture<ContractNumberFollowTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractNumberFollowTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNumberFollowTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
