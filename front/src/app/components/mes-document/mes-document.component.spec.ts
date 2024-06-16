import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDocumentComponent } from './mes-document.component';

describe('MesDocumentComponent', () => {
  let component: MesDocumentComponent;
  let fixture: ComponentFixture<MesDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
