import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {AuthService} from "../../../services/auth/auth.service";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: unknown;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginWithRedirect']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FontAwesomeModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
