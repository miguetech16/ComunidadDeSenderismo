import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-list',
  imports: [ MaterialModule, RouterModule, CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent implements OnInit, OnDestroy {
  userid!: string;
  userChatList: any = [];
  chatList: any = [];
  userSelect: number = 0;
  private paramSub: Subscription | undefined;
  private chatSubs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.userid = params.get('userid') || '';
      if (!this.userid) return;

      this.userChatList = [];
      this.chatList = [];

      this.chatService.getChatsByUserId(this.userid).subscribe(chats => {
        this.userChatList = chats;
        console.log('Objetos chat completos:', this.userChatList);

        if (this.userChatList.length < 1) {
          console.log("Este usuario no cuenta con chats activos.");
          return;
        }

        for (let i = 0; i < this.userChatList.length; i++) {
          const chatId = this.userChatList[i].chatId.trim();

          const sub = this.chatService.getChatbyId(chatId).subscribe(chat => {
            // Evitar duplicados antes de agregar
            if (!this.chatList.some((c: { chatId: any; }) => c.chatId === chat.chatId)) {
              this.chatList.push(chat);
              console.log('Chat por ID:', chat);
            }
          });

          this.chatSubs.push(sub);
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones
    this.paramSub?.unsubscribe();
    this.chatSubs.forEach(sub => sub.unsubscribe());
  }
}

