import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UserCardComponent],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {}
      }
    ]
  })
  .compileComponents();

  fixture = TestBed.createComponent(UserCardComponent);
  component = fixture.componentInstance;
});

  it('should create', () => {
    const user = {
            uid: 'test-uid', 
            email: 'correo',
            profilePicture: 'images/default-profile.png',
            username: 'Prueba',
            fullname: 'Test Prueba',
            profileDescription: 'Descripción',
            isPrivate: false,
            phonenumber: '1234567890'
    };

  component.user = user; // Asigna el input aquí
  fixture.detectChanges(); // Actualiza la vista con el nuevo input

    expect(component).toBeTruthy();
  });
});
