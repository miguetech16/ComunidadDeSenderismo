import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PlannedCardComponent } from './planned-card.component';

describe('PlannedCardComponent', () => {
  let component: PlannedCardComponent;
  let fixture: ComponentFixture<PlannedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedCardComponent],
          providers: [
      {
        provide: ActivatedRoute,
        useValue: {}
      }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannedCardComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {

const plannedRoute = {
  id: 'abc123',
  routeId: 'route456',
  creatorId: 'user789',
  creatorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  creatorName: 'Carlos Pérez',
  plannedRouteTitle: 'Ruta al Pico Verde',
  routePicture: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  date: { toDate: () => new Date('2025-07-04') },
  hour: '08:30',
  planType: true,
  users: ['user789', 'user123', 'user456']
};

  component.plannedRoute = plannedRoute; // Asigna el input aquí
  fixture.detectChanges(); // Actualiza la vista con el nuevo input

    expect(component).toBeTruthy();
  });
});
