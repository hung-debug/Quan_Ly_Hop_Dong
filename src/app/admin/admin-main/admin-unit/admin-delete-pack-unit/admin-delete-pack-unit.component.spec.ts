import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeletePackUnitComponent } from './admin-delete-pack-unit.component';

describe('AdminDeletePackUnitComponent', () => {
  let component: AdminDeletePackUnitComponent;
  let fixture: ComponentFixture<AdminDeletePackUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeletePackUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeletePackUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
