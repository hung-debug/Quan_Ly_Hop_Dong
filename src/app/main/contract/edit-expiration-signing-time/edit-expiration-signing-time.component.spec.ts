import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpirationSigningTimeComponent } from './edit-expiration-signing-time.component';

describe('EditExpirationSigningTimeComponent', () => {
  let component: EditExpirationSigningTimeComponent;
  let fixture: ComponentFixture<EditExpirationSigningTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExpirationSigningTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExpirationSigningTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
