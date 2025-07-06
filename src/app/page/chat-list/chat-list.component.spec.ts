import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './../../app.config';
import { ChatListComponent } from './chat-list.component';
import { of } from 'rxjs';

describe('ChatListComponent', () => {
  let component: ChatListComponent;
  let fixture: ComponentFixture<ChatListComponent>;

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ChatListComponent],
    providers: [
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      ChatService,
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

  fixture = TestBed.createComponent(ChatListComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
