import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforContractComponent } from './infor-contract.component';

describe('InforContractComponent', () => {
  let component: InforContractComponent;
  let fixture: ComponentFixture<InforContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
