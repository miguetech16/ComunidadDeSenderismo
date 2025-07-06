import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

describe('Test - SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  const mockAuthService = {
    logIn: (email: string, password: string) => Promise.resolve(),
    getCurrentUser: () => ({ uid: '123', email: 'test@example.com' })
  };

const mockAuth = {
  currentUser: null,
  setPersistence: () => Promise.resolve(),
  onAuthStateChanged: () => Promise.resolve()
};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Auth, useValue: mockAuth },
        { provide: ActivatedRoute,  useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
