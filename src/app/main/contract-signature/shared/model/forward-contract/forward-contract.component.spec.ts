import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardContractComponent } from './forward-contract.component';

describe('ForwardContractComponent', () => {
  let component: ForwardContractComponent;
  let fixture: ComponentFixture<ForwardContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
