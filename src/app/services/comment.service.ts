import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { comment } from '../interfaces/comment.interface'; 

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private db: Firestore) {}

  getComments(postId: string, direction: string): Observable<comment[]> {
    const commentsCollection = collection(this.db, `${direction}/${postId}/comments`);
    return collectionData(commentsCollection, { idField: 'commentId' }) as Observable<comment[]>;
  }

getCommentById(commentId: string, postId: string, direction: string): Promise<comment | null> {
  const commentRef = doc(this.db, `${direction}/${postId}/comments/${commentId}`);
  return getDoc(commentRef).then(snapshot => {
    if (snapshot.exists()) {
      return { commentId: snapshot.id, ...snapshot.data() } as comment;
    } else {
      return null;
    }
  });
}

  addComment(comment: comment, direction: string): Promise<string> {
    const commentRef = doc(this.db, `${direction}/${comment.postId}/comments/${comment.commentId}`);
    return setDoc(commentRef, comment).then(() => comment.commentId);
  }

  updateComment(comment: comment, direction: string): Promise<void> {
    const commentRef = doc(this.db, `${direction}/${comment.postId}/comments/${comment.commentId}`);
    return updateDoc(commentRef, {
      content: comment.content,
      timestamp: comment.timestamp
    });
  }

  deleteComment(postId: string, commentId: string, direction: string): Promise<void> {
    const commentRef = doc(this.db, `${direction}/${postId}/comments/${commentId}`);
    return deleteDoc(commentRef);
  }
}
