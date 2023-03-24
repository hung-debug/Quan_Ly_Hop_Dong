import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSignListComponent } from './multi-sign-list.component';

describe('MultiSignListComponent', () => {
  let component: MultiSignListComponent;
  let fixture: ComponentFixture<MultiSignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSignListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
