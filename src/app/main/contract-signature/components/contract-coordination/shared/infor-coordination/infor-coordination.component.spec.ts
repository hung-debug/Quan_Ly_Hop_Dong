import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforCoordinationComponent } from './infor-coordination.component';

describe('InforCoordinationComponent', () => {
  let component: InforCoordinationComponent;
  let fixture: ComponentFixture<InforCoordinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforCoordinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
