import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { PlannedRoutesService } from 'src/app/services/planned-routes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-planned-card',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './planned-card.component.html',
  styleUrl: './planned-card.component.css'
})
export class PlannedCardComponent implements OnInit{

  @Input() plannedRoute: any;
  protected currentUserId: any;
  protected userData: any;
  protected isParticipant: boolean = false;
  constructor(private notificationService: NotificationService,
              private userService: UserService,
              private plannedRouteService: PlannedRoutesService,
              private authService: AuthService
  ) {}

async ngOnInit(): Promise<void> {
  
  this.currentUserId = this.authService.getCurrentUser()?.uid || '';

  this.userData = await this.userService.getUserData(this.currentUserId);
  if (!this.userData) {
    console.warn('Usuario no encontrado');
    return;
  }
  this.isUserParticipant();
}

  isUserParticipant() {

    for (let user of this.plannedRoute.users) {
      if (user == this.userData.uid) {
        this.isParticipant = true;
        return;
      }
    }
    this.isParticipant = false;
    return;
  }

  async joinPlannedRoute() {

    await this.plannedRouteService.addUserToPlannedRoute(this.plannedRoute.id, this.userData.uid);
    this.plannedRoute.users.push(this.userData.uid);

    const notification = {
      userId: this.plannedRoute.creatorId,
      message: `¡${this.userData.username} se ha unido a tu Ruta Planificada!`,
      timestamp: new Date(),
      read: false
    };

    this.notificationService.addNotification(notification);
    this.isUserParticipant();
  }


  async exitPlannedRoute() {

    await this.plannedRouteService.removeUserFromPlannedRoute(this.plannedRoute.id, this.userData.uid);
    this.plannedRoute.users.pop();
    this.isUserParticipant();
  }


}
