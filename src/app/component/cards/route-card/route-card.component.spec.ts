import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouteCardComponent } from './route-card.component';

describe('RouteCardComponent', () => {
  let component: RouteCardComponent;
  let fixture: ComponentFixture<RouteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteCardComponent],
          providers: [
            {
              provide: ActivatedRoute,
              useValue: {}
            }
          ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteCardComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {

    const route = {

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

  component.route = route; // Asigna el input aquí
  fixture.detectChanges(); // Actualiza la vista con el nuevo input

    expect(component).toBeTruthy();
  });
});
