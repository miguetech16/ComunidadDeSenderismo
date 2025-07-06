import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouteService } from '../../services/route.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebaseConfig } from './../../app.config';
import { RouteDescriptionComponent } from './route-description.component';
import { of } from 'rxjs';

describe('RouteDescriptionComponent', () => {
  let component: RouteDescriptionComponent;
  let fixture: ComponentFixture<RouteDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDescriptionComponent],
          providers: [
              provideFirebaseApp(() => initializeApp(firebaseConfig)),
              provideFirestore(() => getFirestore()),
              provideAuth(() => getAuth()),
              RouteService,
              {
                      provide: ActivatedRoute,
                      useValue: {
                        paramMap: of({
                          get: (key: string) => key === 'userid' ? '0tLXq1FDfJSNrIkTzm8aOhuEaZd2' : null
                        })
                      }
                    }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteDescriptionComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {

        const routeData = {

          routeId: 'LCnD4Kj7tIhximNqe4pb ',
          userId: "MuWPxvRKWQVAWk410ILj0qGCYLO2",
          title: "Paseo Marítimo",
          description: "Un paseo marítimo encantador, cercano a la playa, perfecto para relajarse.",
          recommendations: "Recomendaría llevar ropa de baño, si hace buen tiempo te arrepentirás si no te das un baño.",
          difficulty: "Fácil",
          distance: 6.4,
          images: ["https://firebasestorage.googleapis.com/v0/b/comunidad-de-senderismo.firebasestorage.app/o/route_pictures%2Fimage_1749055461426_0?alt=media&token=8d540f92-f91c-4127-b25f-7d4e34ad7725"],
          ubication: ["España", "Las Palmas", "Telde"],
          location: {
            lat: 28.007226808784125,
            lng: -15.377938985857329
          } 
    }

    component.routeData = routeData; // Asigna el input aquí
    fixture.detectChanges(); // Actualiza la vista con el nuevo input
    expect(component).toBeTruthy();
  });
});
