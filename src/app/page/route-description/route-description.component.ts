import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { RouteService } from '../../services/route.service';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { comment } from '../../interfaces/comment.interface'; 
import { doc, collection } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MapviewComponent } from '../../component/mapview/mapview.component';
import { RouterModule } from '@angular/router';
import { CommentsComponent } from '../../component/comments/comments.component';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-route-description',
  standalone: true,
  templateUrl: './route-description.component.html',
  styleUrls: ['./route-description.component.css'],
  imports: [ MaterialModule, CommonModule, FormsModule, MapviewComponent, RouterModule, CommentsComponent]
})

export class RouteDescriptionComponent implements OnInit {
  protected routeId!: string;
  routeData: any;
  protected routeTime: any;
  protected comments: comment[] = [];
  protected newCommentContent: string = '';
  protected direction: string = "routes";
  protected creatorUserFlag: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private routeService: RouteService,
    private commentService: CommentService,
    private userService: UserService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('routeid');

      if (id) {
        this.routeId = id;

        this.routeService.getRouteById(this.routeId).subscribe({
          next: data => {
            this.routeData = data;
            this.routeTime = this.routeService.getTimeByRoute(this.routeData.distance);

            this.authService.user$.subscribe(user => {
            const userId = user ? user.uid : null;
            console.log("usuario actual: ", userId);
            console.log("creator: ", this.routeData.userId);
            if (userId == this.routeData.userId){
              this.creatorUserFlag = true;
              console.log("TRUEE");
          }
        });


          },

          error: err => console.error('Error al obtener la ruta', err)
        });

        this.loadComments();
      }
    });
  }


  loadComments() {
    this.commentService.getComments(this.routeId, this.direction).subscribe({
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

    const userData = await this.userService.getCurrentUserData();
    
    if (!userData) {
      console.error('Usuario no autenticado');
      return;
    }

    if (!this.newCommentContent.trim()) return;

    const newCommentRef = doc(collection(this.commentService['db'], `${this.direction}/${this.routeId}/comments`));

    const newComment: comment = {
      commentId: newCommentRef.id,
      postId: this.routeId,
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

        let notification = {
            userId: this.routeData.userId,
            message: `¡Un usuario ha comentado tu ruta!`,
            timestamp: new Date(),
            read: false
    };

        this.notificationService.addNotification(notification);
        
      })
      .catch(err => console.error('Error al enviar comentario', err));
  }

  deleteRoute() {

  const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta Ruta? Esta acción no se puede deshacer.');
  if (confirmed) {
    this.routeService.deleteRoute(this.routeId)
      .then(() => {
        this.router.navigate(["routes"]);
      });
  }
  }


}
