import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignaturePersonalContractComponent } from './signature-personal-contract.component';

describe('SignaturePersonalContractComponent', () => {
  let component: SignaturePersonalContractComponent;
  let fixture: ComponentFixture<SignaturePersonalContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignaturePersonalContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignaturePersonalContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
