import { TestBed } from '@angular/core/testing';

import { CourseService } from './my-course.service';

describe('MesCoursService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
