import { Component, Input} from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { comment } from '../../interfaces/comment.interface';
import { UserService } from '../../services/user.service';
import { doc, collection } from '@angular/fire/firestore';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comments',
  imports: [RouterModule, CommonModule, MaterialModule, FormsModule ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {

  @Input() routeId!: string;
  @Input() direction!: string;
  currentUserId: string | null = null;
  comments: comment[] = [];
  newCommentContent: string = '';
  editingCommentId: string | null = null;
  editedContent: string = '';

  constructor(
    private auth: AuthService,
    private commentService: CommentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadComments();
    this.currentUserId = this.auth.getCurrentUser()?.uid || null;
    console.log('Current User ID:', this.currentUserId);
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
  
      const newCommentRef = doc(collection(this.commentService['db'], `routes/${this.routeId}/comments`));
  
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
        })
        .catch(err => console.error('Error al enviar comentario', err));
    }

    deleteComment(commentId: string) {
      this.commentService.deleteComment(this.routeId, commentId, this.direction)
        .then(() => {
          this.loadComments();
        })
        .catch(err => console.error('Error al eliminar comentario', err));
    }

     startEdit(commentId: string) {
    const comment = this.comments.find(c => c.commentId === commentId);
    if (comment) {
      this.editedContent = comment.content; 
      this.editingCommentId = commentId;
    }
  }

  async updateComment(commentId: string) {
    const comment = await this.commentService.getCommentById(commentId, this.routeId, this.direction);
    if (comment) {
      if (!this.editedContent.trim()) {
          this.editingCommentId = null;
          this.loadComments();
          return;
      }
      comment.content = this.editedContent;
      await this.commentService.updateComment(comment, this.direction);
      this.editingCommentId = null;
      this.loadComments();
    } else {
      console.error('Comentario no encontrado');
    }
  }

}
