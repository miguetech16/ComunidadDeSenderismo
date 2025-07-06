import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteService } from '../../services/route.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebaseConfig } from './../../app.config';
import { StorageService } from '../../services/storage.service';
import { CustomRoutesComponent } from './custom-routes.component';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';


describe('CustomRoutesComponent', () => {
  let component: CustomRoutesComponent;
  let fixture: ComponentFixture<CustomRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRoutesComponent],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        importProvidersFrom(
          AngularFireModule.initializeApp(firebaseConfig),
          AngularFireStorageModule
        ),
        RouteService,
        StorageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
