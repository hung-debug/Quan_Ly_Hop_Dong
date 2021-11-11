import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSignatureComponent } from './footer-signature.component';

describe('FooterSignatureComponent', () => {
  let component: FooterSignatureComponent;
  let fixture: ComponentFixture<FooterSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterSignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
