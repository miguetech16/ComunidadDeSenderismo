import { Firestore, collection, collectionData, deleteDoc, addDoc, doc, updateDoc, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  constructor(private db: Firestore) {}

  getNotificationsByUserId(userId: string): Observable<any[]> {
    const notificationsCollection = collection(this.db, `users/${userId}/notifications`);
    return collectionData(notificationsCollection, { idField: 'id' }) as Observable<any[]>;
  }

  async addNotification(notification: any): Promise<void> {
    const notificationsRef = collection(this.db, `users/${notification.userId}/notifications`);
    await addDoc(notificationsRef, {
      ...notification,
      timestamp: Timestamp.now(),
      read: false
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notificationDoc = doc(this.db, `users/${userId}/notifications/${notificationId}`);
    await updateDoc(notificationDoc, { read: true });
  }

async deleteNotification(notificationId: string, userId: string): Promise<void> {
  const notificationDoc = doc(this.db, `users/${userId}/notifications/${notificationId}`);
  await deleteDoc(notificationDoc); 
}

}