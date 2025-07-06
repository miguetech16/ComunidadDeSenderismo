import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../services/user.service';
import { EditProfileComponent } from './edit-profile.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../app.config';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ReactiveFormsModule } from '@angular/forms';



describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  const mockUserData = {
  username: 'TestUser',
  fullname: 'Test User',
  profileDescription: 'Descripción',
  profilePicture: '',
  isPrivate: false,
  email: 'test@example.com',
  phonenumber: '123456789'
};

const mockUserService = {
  getUserData: () => Promise.resolve(mockUserData),
  updateUserData: () => Promise.resolve()
};

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [EditProfileComponent],
    providers: [
      { provide: UserService, useValue: mockUserService },
      importProvidersFrom(
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireStorageModule
      ),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      { 
        provide: ActivatedRoute,  
        useValue: {
          paramMap: {
            subscribe: (fn: (params: any) => void) => fn({
              get: (key: string) => key === 'userid' ? 'test-user-id' : null
            })
          }
        }
      },
      StorageService
    ]
  })
  .compileComponents();

  fixture = TestBed.createComponent(EditProfileComponent);
  component = fixture.componentInstance;
  // Espera a que se resuelvan las promesas y se inicialicen los formularios
  await fixture.whenStable();
  fixture.detectChanges();
});

  it('should create', () => {

    
    expect(component).toBeTruthy();
  });
});
