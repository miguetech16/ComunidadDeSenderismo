import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteService } from '../../services/route.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebaseConfig } from './../../app.config';
import { PlannedRoutesComponent } from './planned-routes.component';

describe('PlannedRoutesComponent', () => {
  let component: PlannedRoutesComponent;
  let fixture: ComponentFixture<PlannedRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedRoutesComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        RouteService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannedRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
