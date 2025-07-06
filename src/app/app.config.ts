import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes'; 
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideRouter } from '@angular/router';
import { provideStorage, getStorage } from '@angular/fire/storage'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { importProvidersFrom } from '@angular/core';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCNkabDK25Dt3-3qOM7R69SoYcMOFUAAuQ",
  authDomain: "comunidad-de-senderismo.firebaseapp.com",
  databaseURL: "https://comunidad-de-senderismo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "comunidad-de-senderismo",
  storageBucket: "comunidad-de-senderismo.firebasestorage.app",
  messagingSenderId: "383254907887",
  appId: "1:383254907887:web:d02380e757a49505ecc41a",
  measurementId: "G-W1GQMG1XKF"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule),
  ]
};
