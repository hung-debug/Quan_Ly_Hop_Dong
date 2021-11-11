import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderContractComponent } from './header-contract.component';

describe('HeaderContractComponent', () => {
  let component: HeaderContractComponent;
  let fixture: ComponentFixture<HeaderContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
