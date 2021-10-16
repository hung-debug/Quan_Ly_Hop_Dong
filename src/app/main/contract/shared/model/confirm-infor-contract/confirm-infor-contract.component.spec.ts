import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInforContractComponent } from './confirm-infor-contract.component';

describe('ConfirmInforContractComponent', () => {
  let component: ConfirmInforContractComponent;
  let fixture: ComponentFixture<ConfirmInforContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInforContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInforContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
