import { TestBed } from '@angular/core/testing';

import { MyCourseService } from './my-course.service';

describe('MesCoursService', () => {
  let service: MyCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
