import { Component, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { user } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Subscription, switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-header',
  imports: [ MaterialModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [UserService, AuthService, NotificationService]
})
export class HeaderComponent implements OnDestroy {

  protected user: user | null = null;
  private subscription = new Subscription();
  protected notifications: any[] = []; 

  constructor (
    private userService: UserService, 
    private auth: AuthService,
    private notificationService: NotificationService) {
    this.listenToAuth();
  }

  private listenToAuth() {
  const sub = this.auth.user$
    .pipe(
      switchMap((firebaseUser) => {
        if (firebaseUser) {
          return this.userService.getUserDataObs(firebaseUser.uid);
        } else {
          return of(null);
        }
      })
    )
    .subscribe((profile) => {
      this.user = profile;
    
      if (this.user && this.user.uid) {
        this.notificationService.getNotificationsByUserId(this.user.uid)
          .subscribe((notifications) => {
            this.notifications = notifications;
            console.log('Notificaciones obtenidas:', this.notifications);
          });
      }
    });

  this.subscription.add(sub);
}


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  markAsRead(notificationId: string) {

    if (this.user && this.user.uid) {
      this.notificationService.markAsRead(notificationId, this.user.uid)
    }
  }

  deleteNotification(event: Event, notification: any) {
    event.stopPropagation(); 
    this.notificationService.deleteNotification(notification.id, this.user!.uid);
  }

}
