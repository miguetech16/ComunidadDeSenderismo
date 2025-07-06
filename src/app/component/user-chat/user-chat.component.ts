import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-chat',
  imports: [ MaterialModule, CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.css'
})
export class UserChatComponent implements OnInit, AfterViewChecked{

  chatId: string = "";
  userid: string = "";
  chatData: any;
  newMessage: string = "";
  messagesList: any[] = [];
  private shouldScroll: boolean = false;

  constructor(
    private userService: UserService, 
    private chatService: ChatService,
    private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
  const userData = await this.userService.getCurrentUserData();

  if (!userData) {
    console.error('Usuario no autenticado');
    return;
  }

  this.userid = userData.uid.trim();
  console.log("UserId:", this.userid);

  this.route.paramMap.subscribe(params => {
    this.chatId = params.get('chatId') || '';
    if (!this.chatId) return;

    console.log("ChatId:", this.chatId);

    this.chatService.getChatbyId(this.chatId).subscribe(chat => {
      if (!chat) {
        console.error('Chat no encontrado');
        return;
      }
      this.chatData = chat;
      this.loadMessages();
      setTimeout(() => {
          this.scrollToTheLastElementByClassName();
      }, 10);
    });
  });
}

loadMessages() {
  this.chatService.getMessages(this.chatId).subscribe((messages: any[]) => {
    this.messagesList = messages;
    this.shouldScroll = true;
    console.log("messagesList: ", this.messagesList);
  });
}

sendMessage() {
  this.chatService.sendMessage(this.chatId, this.userid, this.newMessage).then(() => {
    console.log("Mensaje enviado correctamente");
    this.newMessage = "";
    this.loadMessages();
  });
}

  ngAfterViewChecked(): void {
  if (this.shouldScroll) {
    this.scrollToTheLastElementByClassName();
    this.shouldScroll = false;
  }
}

scrollToTheLastElementByClassName() {
  const elements = document.getElementsByClassName('msg');
  if (elements.length === 0) return;

  const lastMessage = elements[elements.length - 1] as HTMLElement;
  const container = document.getElementById("message-container");

  if (container && lastMessage) {
    container.scrollTop = lastMessage.offsetTop;
  }
}


}
