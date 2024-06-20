import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCoursesComponent } from './recent-courses.component';

describe('RecentCoursesComponent', () => {
  let component: RecentCoursesComponent;
  let fixture: ComponentFixture<RecentCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
