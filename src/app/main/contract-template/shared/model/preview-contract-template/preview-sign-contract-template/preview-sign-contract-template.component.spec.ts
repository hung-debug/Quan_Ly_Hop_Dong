import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSignContractTemplateComponent } from './preview-sign-contract-template.component';

describe('PreviewSignContractTemplateComponent', () => {
  let component: PreviewSignContractTemplateComponent;
  let fixture: ComponentFixture<PreviewSignContractTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewSignContractTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSignContractTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
