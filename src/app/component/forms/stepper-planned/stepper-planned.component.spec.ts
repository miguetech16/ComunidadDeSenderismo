import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../../app.config';
import { RouteService } from '../../../services/route.service';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { StepperPlannedComponent } from './stepper-planned.component';

describe('StepperPlannedComponent', () => {
  let component: StepperPlannedComponent;
  let fixture: ComponentFixture<StepperPlannedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperPlannedComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        RouteService
      ]
                      
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperPlannedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
