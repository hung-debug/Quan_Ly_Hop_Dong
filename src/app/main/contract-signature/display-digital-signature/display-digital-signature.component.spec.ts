import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDigitalSignatureComponent } from './display-digital-signature.component';

describe('DisplayDigitalSignatureComponent', () => {
  let component: DisplayDigitalSignatureComponent;
  let fixture: ComponentFixture<DisplayDigitalSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayDigitalSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDigitalSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
