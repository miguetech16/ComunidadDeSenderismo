import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PlannedRoutesService } from 'src/app/services/planned-routes.service';
import { MaterialModule } from 'src/app/modules/material.module';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';
import { UserCardComponent } from 'src/app/component/cards/user-card/user-card.component';
import { user} from "../../interfaces/user.interface"
import { CommentsComponent } from 'src/app/component/comments/comments.component';
import { CommentService } from 'src/app/services/comment.service';
import { comment } from 'src/app/interfaces/comment.interface';
import { doc, collection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planned-view',
  templateUrl: './planned-view.component.html',
  imports: [MaterialModule, CommonModule, RouterModule, FormsModule, UserCardComponent, CommentsComponent],
  styleUrls: ['./planned-view.component.scss'],
})
export class PlannedViewComponent  implements OnInit {

  protected plannedRouteData: any;
  protected participants: user[] = [];
  protected direction: string = "plannedRoutes";
  protected comments: comment[] = [];
  protected newCommentContent: string = '';
  protected currentUserFlag: boolean = false;
  protected currentUserId: string = '';
  protected participantFlag: boolean = false;
  protected updateDateflag: boolean = false;
  protected updateHourflag: boolean = false;
  protected selectedHour: string ='';
  protected selectedDate: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private plannedRoutesService: PlannedRoutesService,
              private UserService: UserService,
              private commentService: CommentService,
              private authService: AuthService
  ) { }

  async ngOnInit() {

    this.currentUserId= this.authService.getCurrentUser()?.uid || '';

    if (!this.currentUserId) { return }

    this.route.paramMap.subscribe(async params => {
    const plannedRouteId = params.get('plannedid') || '';
    this.plannedRouteData = await this.plannedRoutesService.getPlannedRouteById(plannedRouteId);
    
    this.currentUserFlag = this.currentUserId === this.plannedRouteData.creatorId;

    if (!this.currentUserFlag){
      if (!this.plannedRouteData.users.includes(this.currentUserId) && !this.plannedRouteData.planType){
        this.router.navigate(['community']);
      }
   }

    for (let userId of this.plannedRouteData.users){

      if (userId == this.currentUserId) {
        this.participantFlag = true;
      }

      const userObj = await this.UserService.getUserData(userId);
      if (userObj) {
        this.participants.push(userObj);
      }
    }

    console.log(this.plannedRouteData);
    this.loadComments();

  });
}


  loadComments() {
    this.commentService.getComments(this.plannedRouteData, this.direction).subscribe({
      next: async (data) => {
        this.comments = data
          .map(c => ({
            ...c,
            timestamp: this.convertTimestamp(c.timestamp)
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
      }, error: (err) => console.error('Error al cargar comentarios', err)
    });
  }

  convertTimestamp(value: any): number {
    if (typeof value === 'number') return value;
    if (value && typeof value.toMillis === 'function') return value.toMillis();
    return 0;
  }

  async submitComment() {

    const userData = await this.UserService.getCurrentUserData();
    
    if (!userData) {
      console.error('Usuario no autenticado');
      return;
    }

    if (!this.newCommentContent.trim()) return;

    const newCommentRef = doc(collection(this.commentService['db'], `${this.direction}/${this.plannedRouteData.id}/comments`));

    const newComment: comment = {
      commentId: newCommentRef.id,
      postId: this.plannedRouteData.id,
      userId: userData.uid,
      username: userData.username || 'Usuario desconocido',
      profilePicture: userData.profilePicture || 'https://example.com/default-profile.png',
      content: this.newCommentContent,
      timestamp: Date.now()
    };

    this.commentService.addComment(newComment, this.direction)
      .then(() => {
        this.newCommentContent = '';
        this.loadComments();        
      })
      .catch(err => console.error('Error al enviar comentario', err));
  }

  removeParticipant(userId: string){
    console.log(this.plannedRouteData.id)
    this.plannedRoutesService.removeUserFromPlannedRoute(this.plannedRouteData.id, userId);
    this.participants = this.participants.filter(user => user.uid !== userId);
  }

inviteUser() {
  const fecha = new Date(this.plannedRouteData.date.seconds * 1000);
  const fechaString = fecha.toLocaleDateString();

  const inviteLink = 
`¡Has sido invitado a unirte a una Ruta Planificada!
Título de la ruta: ${this.plannedRouteData.plannedRouteTitle}
Fecha: ${fechaString}
Hora: ${this.plannedRouteData.hour}

Accede a partir de este enlace en la planificación:
${window.location.origin}/planned-invite/${this.plannedRouteData.id}

¡No te lo pierdas!`;

  navigator.clipboard.writeText(inviteLink).then(() => {
    alert('¡Enlace de invitación copiado! Usa el chat para enviar invitaciones');
  });
}

exitPlan() {
  const confirmed = window.confirm('¿Estás seguro de que quieres dejar esta planificación?');
  if (confirmed) {
    this.plannedRoutesService.removeUserFromPlannedRoute(this.plannedRouteData.id, this.currentUserId)
      .then(() => {
        this.router.navigate(["user-profile", this.plannedRouteData.creatorId]);
      });
  }
}

async joinPlan() {

  this.plannedRoutesService.addUserToPlannedRoute(this.plannedRouteData.id, this.currentUserId)
  this.participantFlag = true;
  const user = await this.UserService.getUserData(this.currentUserId);
  if (user) {
    this.participants.push(user);
  }
}


deletePlannedRoute() {
  const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta planificación? Esta acción no se puede deshacer.');
  if (confirmed) {
    this.plannedRoutesService.deletePlannedRoute(this.plannedRouteData.id)
      .then(() => {
        this.router.navigate(["user-profile", this.plannedRouteData.creatorId]);
      });
  }
}

updateDate() {
  if (!this.updateDateflag) {
    const jsDate = this.plannedRouteData.date.toDate ? this.plannedRouteData.date.toDate() : this.plannedRouteData.date;
    this.selectedDate = jsDate ? this.formatDateToInput(jsDate) : '';
    this.updateDateflag = true;
  } else {

    const newDate = new Date(this.selectedDate);

    const updatedPlan = { ...this.plannedRouteData, date: newDate };
    this.plannedRoutesService.updatePlannedRoute(this.plannedRouteData.id, updatedPlan)
      .then(() => {
        this.plannedRouteData.date = newDate;
        this.updateDateflag = false;
      });
  }
}

cancelUpdateDate() {
  this.updateDateflag = false;
  this.selectedDate = '';
}

formatDateToInput(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  return `${yyyy}-${mm}-${dd}`;
}

updateHour() {
  if (!this.updateHourflag) {
    this.selectedHour = this.plannedRouteData.hour || '08:00';
    this.updateHourflag = true;
  } else {
    // Guardar cambios
    const updatedPlan = { ...this.plannedRouteData, hour: this.selectedHour };
    this.plannedRoutesService.updatePlannedRoute(this.plannedRouteData.id, updatedPlan)
      .then(() => {
        this.plannedRouteData.hour = this.selectedHour; 
        this.updateHourflag = false;
      });
  }
}

cancelUpdateHour() {
  this.updateHourflag = false;
  this.selectedHour = '';
}


}
