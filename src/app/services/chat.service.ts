import { Firestore, collection, collectionData, doc, docData, updateDoc, getDocs, query, where, setDoc, addDoc, Timestamp, orderBy } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

 constructor(private db: Firestore) {}

  getChats(): Observable<any[]> {
    const chatsCollection = collection(this.db, `chats`);
    return collectionData(chatsCollection, { idField: 'chatId' }) as Observable<any[]>;
  }

getChatbyId(chatId: string): Observable<any> {
  const chatDoc = doc(this.db, `chats/${chatId}`);
  return docData(chatDoc, { idField: 'chatId' }).pipe(
    catchError(err => {
      console.error(`No se encontró el chat con ID: ${chatId}`, err);
      return of({ error: true, message: `No se encontró el chat con ID: ${chatId}` });
    })
  );
}

getChatsByUserId(userId: string): Observable<any[]> {
  const chatListRef = collection(this.db, `users/${userId}/chatList`);
  return collectionData(chatListRef, { idField: 'chatId' });
}


getMessages(chatId: string): Observable<any[]> {
    const messagesCollection = collection(this.db, `chats/${chatId}/messages`);
    const orderedMessages = query(messagesCollection, orderBy('timestamp', 'asc'));
    return collectionData(orderedMessages, { idField: 'messageId' }) as Observable<any[]>;
  }

async addChat(users: string[], chatPicture: string[], userNames: string[]): Promise<string> {
  if (users.length < 2) {
    throw new Error('Un chat debe tener al menos 2 usuarios.');
  }

  const chatsRef = collection(this.db, 'chats');
  const chatQuery = query(chatsRef, where('users', 'array-contains', users[0]));
  const existingChatsSnap = await getDocs(chatQuery);

  for (const docSnap of existingChatsSnap.docs) {
    const existingUsers = docSnap.data()['users'] as string[];
    const isSameChat = users.length === existingUsers.length &&
      users.every(userId => existingUsers.includes(userId));

    if (isSameChat) {
      return docSnap.id;
    }
  }

  const chatData = {
    chatId: '',
    users,
    chatPicture,
    userNames,
    timestamp: Timestamp.now(),
  };

  const newChatRef = await addDoc(chatsRef, chatData);
  await setDoc(newChatRef, { chatId: newChatRef.id }, { merge: true });

  for (const uid of users) {
    const userChatRef = doc(this.db, `users/${uid}/chatList/${newChatRef.id}`);
    await setDoc(userChatRef, { chatId: newChatRef.id });
  }

  return newChatRef.id;
}

async sendMessage(chatId: string, userId: string, message: string): Promise<void> {
  if (!chatId || !userId || !message.trim()) {
    throw new Error('chatId, userId y message son requeridos para enviar un mensaje.');
  }

  const trimmedMessage = message.trim();
  const timestamp = Timestamp.now();

  const messageData = {
    emiterId: userId.trim(),
    message: trimmedMessage,
    timestamp: timestamp
  };

  try {
    
    const messagesCollection = collection(this.db, `chats/${chatId}/messages`);
    await addDoc(messagesCollection, messageData);

    const chatDocRef = doc(this.db, `chats/${chatId}`);
    await updateDoc(chatDocRef, {
      lastMessage: trimmedMessage,
      timestamp: timestamp
    });

    console.log('Mensaje enviado y chat actualizado correctamente');
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
}
}