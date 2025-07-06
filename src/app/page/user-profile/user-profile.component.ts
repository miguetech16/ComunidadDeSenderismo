import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { UserService } from '../../services/user.service';
import { user } from '../../interfaces/user.interface';
import { RouteCardComponent } from '../../component/cards/route-card/route-card.component';
import { RouteService } from '../../services/route.service';
import { Observable, from } from 'rxjs';
import { plannedRoute } from '../../interfaces/planned-route.interface';
import { PlannedRoutesService } from '../../services/planned-routes.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PlannedCardComponent } from '../../component/cards/planned-card/planned-card.component';
import { ChatService } from '../../services/chat.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ CommonModule, MaterialModule, RouteCardComponent, RouterModule, PlannedCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  })

export class UserProfileComponent implements OnInit {

  protected userid!: string;
  protected userData: user | null = null;
  protected currentuserid!: string;
  protected currentuserflag!: boolean;
  protected routes$!: Observable<any[]>;
  protected plannedRoutes$!: Observable<plannedRoute[]>;
  protected followers: any[] = [];
  protected following: any[] = [];
  protected isfollower!: boolean; 

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private routeService: RouteService,
    private plannedRoutesService: PlannedRoutesService,
    private chatService: ChatService,
    private notificationService: NotificationService
  ) {}

 async ngOnInit() {
  
  this.currentuserid = this.auth.getCurrentUser()?.uid || '';

  this.route.paramMap.subscribe(async params => {
    this.userid = params.get('userid') || '';
    if (!this.userid) return;

    this.currentuserflag = this.userid === this.currentuserid;

    this.userService.getFollowers(this.userid).subscribe(followers => {
      this.followers = followers;
    });

    this.userService.getFollowing(this.userid).subscribe(following => {
      this.following = following;
    });

    if (this.currentuserflag) {
      this.userData = await this.userService.getCurrentUserData();
    } else {
      this.userData = await this.userService.getUserData(this.userid);
    }

    if (!this.userData) {
      console.warn("No se pudo obtener información del usuario");
      return;
    }

    console.log("Datos del usuario:", this.userData.uid);

    if (!this.currentuserflag && this.userData.isPrivate) {
      console.warn("El perfil es privado");
      return;
    }
    this.isfollower = await this.userService.isFollowing(this.currentuserid, this.userid);
    console.log(this.isfollower);
    this.routes$ = this.routeService.getRoutesByUser(this.userid);
    this.plannedRoutes$ = from(this.plannedRoutesService.getRoutesByUserId(this.userid));

  });
}

  logOut() {
    this.auth.logOut()
      .then(() => this.router.navigate(['sign-in']))
      .catch(error => console.warn(error));
  }

  deleteAccount() {
    const currentUser = this.auth.getCurrentUser();
    if (currentUser) {
      this.userService.deleteUser(currentUser.uid)
        .then(() => {
          console.log('Usuario eliminado');
          this.router.navigate(['sign-in']);
        })
        .catch(error => console.error('Error al eliminar el usuario:', error));
    } else {
      console.warn('No hay usuario autenticado');
    }
  }

  followAccount(currentUserId: string, userId: string) {
    this.userService.followAccount(currentUserId, userId);

    let notification = {
      userId: userId,
      message: `¡Un usuario ha comenzado a seguirte!`,
      timestamp: new Date(),
      read: false
    };
    this.notificationService.addNotification(notification);

    this.ngOnInit();
  }

  unfollowAccount(currentUserId: string, userId: string) {
    this.userService.unfollowAccount(currentUserId, userId);
    this.ngOnInit();
  }

async sendMessage() {
  const currentUserData = await this.userService.getCurrentUserData();

  try {
    const chatId = await this.chatService.addChat(
      [this.userid, currentUserData?.uid ?? ''],
      [this.userData?.profilePicture ?? '', currentUserData?.profilePicture ?? ''],
      [this.userData?.username ?? '', currentUserData?.username ?? '']
    );

    console.log("ChatId:", chatId);
    this.router.navigate(['/user-chat', chatId]);

  } catch (error) {
    console.error("Error al crear el chat:", error);
  }
}

}
