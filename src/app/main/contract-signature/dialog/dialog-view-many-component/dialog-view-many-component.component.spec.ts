import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewManyComponentComponent } from './dialog-view-many-component.component';


describe('DialogSignManyComponentComponent', () => {
    let component: DialogViewManyComponentComponent;
    let fixture: ComponentFixture<DialogViewManyComponentComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ DialogViewManyComponentComponent ]
      })
      .compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(DialogViewManyComponentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });