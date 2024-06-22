import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeSafeComponent } from './iframe-safe.component';

describe('IframeSafeComponent', () => {
  let component: IframeSafeComponent;
  let fixture: ComponentFixture<IframeSafeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeSafeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IframeSafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
