import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryContractComponent } from './secretary-contract.component';

describe('SecretaryContractComponent', () => {
  let component: SecretaryContractComponent;
  let fixture: ComponentFixture<SecretaryContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretaryContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretaryContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
