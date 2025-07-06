import { Injectable } from '@angular/core';
import { Firestore, docData } from '@angular/fire/firestore';  
import { user } from '../interfaces/user.interface';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { getDoc } from 'firebase/firestore';
import { collection} from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private db: Firestore, private auth: AuthService) { }

addUser(uid: string, user: user) {
  const userDoc = doc(this.db, `users/${uid}`);
  return setDoc(userDoc, user);
}

getUsers(): Observable<any[]> {
    const usersCollection = collection(this.db, 'users');
    return collectionData(usersCollection, { idField: 'id' });
  }

getUserDataObs(uid: string): Observable<user> {
    const userDoc = doc(this.db, `users/${uid}`);
    return docData(userDoc) as Observable<user>;
  }

getUserData(uid: string): Promise<user | null> {
  const userDocRef = doc(this.db, `users/${uid}`);
  return getDoc(userDocRef).then((userData) => {

    if (userData.exists()) {
      return userData.data() as user;
    } else {
      console.warn('No se encontró el documento del usuario en Firestore');
      return null;
    }

  }).catch((error) => {
    console.error('Error al obtener el usuario:', error);
    return null;
  });
}

async getCurrentUserData(): Promise<user | null> {
  const currentUser = this.auth.getCurrentUser();

  if (!currentUser) {
    console.warn('No hay usuario autenticado');
    return null;
  }

  const userDocRef = doc(this.db, `users/${currentUser.uid}`);
  const userData = await getDoc(userDocRef);

  if (userData.exists()) {
    return userData.data() as user;
  } else {
    console.warn('No se encontró el documento del usuario en Firestore');
    return null;
  }
}

getFollowers(uid: string): Observable<any[]> {
  const followersCollection = collection(this.db, `users/${uid}/followers`);
  return collectionData(followersCollection, { idField: 'id' });
}

getFollowing(uid: string): Observable<any[]> {
  const followingCollection = collection(this.db, `users/${uid}/following`);
  return collectionData(followingCollection, { idField: 'id' });
}

async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
  if (currentUserId === targetUserId) return false; // No se puede seguir a sí mismo

  const docRef = doc(this.db, `users/${currentUserId}/following/${targetUserId}`);
  const docSnap = await getDoc(docRef);

  return docSnap.exists();
}


followAccount(currentUserId: string, followedUserId: string) {
  if (currentUserId === followedUserId) return; // Evitar seguirse a sí mismo

  const currentUserRef = doc(this.db, `users/${currentUserId}`);
  const followedUserRef = doc(this.db, `users/${followedUserId}`);

  // Obtener info de ambos usuarios
  Promise.all([getDoc(currentUserRef), getDoc(followedUserRef)])
    .then(([currentUserSnap, followedUserSnap]) => {
      if (!currentUserSnap.exists() || !followedUserSnap.exists()) {
        console.error("Alguno de los usuarios no fue encontrado.");
        return;
      }

      const currentUserData = currentUserSnap.data();
      const followedUserData = followedUserSnap.data();

      const followedAt = new Date();

      // Info del usuario seguido → para guardar en "following"
      const followingInfo = {
        followedAt,
        userId: followedUserId,
        userName: followedUserData['username'],
        userPicture: followedUserData['profilePicture'] || null
      };

      // Info del seguidor → para guardar en "followers"
      const followerInfo = {
        followedAt,
        userId: currentUserId,
        userName: currentUserData['username'],
        userPicture: currentUserData['profilePicture'] || null
      };

      // Referencias a los documentos
      const followingRef = doc(this.db, `users/${currentUserId}/following/${followedUserId}`);
      const followersRef = doc(this.db, `users/${followedUserId}/followers/${currentUserId}`);

      // Guardar ambas relaciones
      Promise.all([
        setDoc(followingRef, followingInfo),
        setDoc(followersRef, followerInfo)
      ]).then(() => {
        console.log("Seguido exitosamente");
      }).catch(error => {
        console.error("Error al seguir usuario:", error);
      });

    }).catch(error => {
      console.error("Error al obtener datos del usuario:", error);
    });
}

unfollowAccount(currentUserId: string, followedUserId: string) {
  if (currentUserId === followedUserId) return; // Evitar dejar de seguirse a sí mismo

  // Referencias a los documentos que deben eliminarse
  const followingRef = doc(this.db, `users/${currentUserId}/following/${followedUserId}`);
  const followersRef = doc(this.db, `users/${followedUserId}/followers/${currentUserId}`);

  // Eliminar ambas relaciones
  Promise.all([
    deleteDoc(followingRef),
    deleteDoc(followersRef)
  ])
  .then(() => {
    console.log("Dejado de seguir exitosamente");
  })
  .catch(error => {
    console.error("Error al dejar de seguir usuario:", error);
  });
}

updateUserData(uid: string, userData: Partial<user>) {
  const userDoc = doc(this.db, `users/${uid}`);
  return setDoc(userDoc, userData, { merge: true });
}

deleteUser(uid: string) {
  const userDoc = doc(this.db, `users/${uid}`);
  return setDoc(userDoc, {});
}

}
