import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../../app.config';
import { SignUpComponent } from './sign-up.component';
import { UserService } from '../../../services/user.service';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

describe('SingUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
       providers: [
              provideFirebaseApp(() => initializeApp(firebaseConfig)),
              provideFirestore(() => getFirestore()),
              provideAuth(() => getAuth()),
              UserService,
              {  provide: ActivatedRoute,  useValue: {} },
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
