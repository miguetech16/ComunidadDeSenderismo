import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../../app.config';
import { RouteService } from '../../../services/route.service';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { StepperCustomComponent } from './stepper-custom.component';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

describe('StepperCustomComponent', () => {
  let component: StepperCustomComponent;
  let fixture: ComponentFixture<StepperCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperCustomComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        importProvidersFrom(
          AngularFireModule.initializeApp(firebaseConfig),
          AngularFireStorageModule
        ),
        RouteService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
