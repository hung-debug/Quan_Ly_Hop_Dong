import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNumberFollowSignComponent } from './contract-number-follow-sign.component';

describe('ContractNumberFollowSignComponent', () => {
  let component: ContractNumberFollowSignComponent;
  let fixture: ComponentFixture<ContractNumberFollowSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractNumberFollowSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNumberFollowSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
