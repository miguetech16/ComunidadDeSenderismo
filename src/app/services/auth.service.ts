import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { updatePassword } from 'firebase/auth';
import { confirmPasswordReset } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router, private auth: Auth) {
    this.initAuthListener(); 
  }

  private initAuthListener() {

    setPersistence(this.auth, browserLocalPersistence);

    onAuthStateChanged(this.auth, (user: User | null) => {
      this.userSubject.next(user);
    });
  }


  register(credentials: { email: string, password: string }) {
    return createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }


  logIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logOut() {
    return this.auth.signOut();
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getCurrentUser$(): Observable<User | null> {
    return new Observable(subscriber => {
      return onAuthStateChanged(this.auth, user => subscriber.next(user));
    });
  }

waitForAuthInit(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        resolve(user);
        unsubscribe();
      });
    });
  }

  changePassword(newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return Promise.reject('No hay usuario autenticado.');
    }
    console.log("Nueva contraseña actualizada.")
    return updatePassword(user, newPassword);
  }

  resetPasswordWithCode(oobCode: string, newPassword: string): Promise<void> {
  return confirmPasswordReset(this.auth, oobCode, newPassword);
}

}

