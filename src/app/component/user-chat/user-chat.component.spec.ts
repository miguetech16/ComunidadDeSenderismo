import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../services/user.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../app.config';
import { UserChatComponent } from './user-chat.component';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

describe('UserChatComponent', () => {
  let component: UserChatComponent;
  let fixture: ComponentFixture<UserChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatComponent],
                  providers: [
                provideFirebaseApp(() => initializeApp(firebaseConfig)),
                provideFirestore(() => getFirestore()),
                provideAuth(() => getAuth()),
                UserService,
                 {  provide: ActivatedRoute,  useValue: {} },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {

        const chatData = {
            chatId: "1XR24dJhfdcWvZojVxjA", 
            chatPicture: ["https://firebasestorage.googleapis.com/v0/b/comunidad-de-senderismo.firebasestorage.app/o/profile_pictures%2Fimage_1749055599957_%24%3B?alt=media&token=02f1870d-b9d1-4d26-a131-5368fd909144",
                          "https://firebasestorage.googleapis.com/v0/b/comunidad-de-senderismo.firebasestorage.app/o/profile_pictures%2Fimage_1751276357199_%24%3B?alt=media&token=150d0fc8-fae4-41f3-82f8-f66546506d33"
            ],
            lastMessage: "Una rutaa?",
            timestamp: 1751276357199,
            userNames: ["Juan", "Pedro"],
            users: ["cZIbHZ6NkMNs7CzG5pbTruiA2Z42", "cZIbHZ6NkMNs7CzG5pbTruiA2Z43"],    
            
    };

  component.chatData = chatData; // Asigna el input aquí
  fixture.detectChanges(); // Actualiza la vista con el nuevo input
    expect(component).toBeTruthy();
  });
});
