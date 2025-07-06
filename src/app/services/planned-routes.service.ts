import { Injectable } from '@angular/core';
import {  Firestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, DocumentData,  CollectionReference,} from '@angular/fire/firestore';
import { plannedRoute } from '../interfaces/planned-route.interface';
import { arrayUnion, arrayRemove  } from '@firebase/firestore';


@Injectable({
  providedIn: 'root',
})
export class PlannedRoutesService {
  private collectionRef: CollectionReference<DocumentData>;

  constructor(private db: Firestore) {
    this.collectionRef = collection(this.db, 'plannedRoutes');
  }

  // Crear ruta planificada
  async createPlannedRoute(route: plannedRoute) {
    return await addDoc(this.collectionRef, route);
  }

  // Obtener todas las rutas planificadas
  async getAllPlannedRoutes(): Promise<plannedRoute[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<plannedRoute, 'id'>;
      return { id: docSnap.id, ...data };
    });
  }

  // Obtener rutas por usuario
  async getRoutesByUserId(userId: string): Promise<plannedRoute[]> {
    const q = query(this.collectionRef, where('users', 'array-contains', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<plannedRoute, 'id'>;
      return { id: docSnap.id, ...data };
    });
  }

  // Obtener una ruta por ID
  async getPlannedRouteById(id: string): Promise<plannedRoute | undefined> {
    const docRef = doc(this.db, 'plannedRoutes', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Omit<plannedRoute, 'id'>;
      return { id: snap.id, ...data };
    }
    return undefined;
  }

  // Actualizar una ruta
  async updatePlannedRoute(id: string, updatedRoute: Partial<plannedRoute>): Promise<void> {
    const docRef = doc(this.db, 'plannedRoutes', id);
    await updateDoc(docRef, updatedRoute as DocumentData);
  }

  // Eliminar una ruta
  async deletePlannedRoute(id: string): Promise<void> {
    const docRef = doc(this.db, 'plannedRoutes', id);
    await deleteDoc(docRef);
  }

  async addUserToPlannedRoute(plannedRouteId: string, userId: string): Promise<void> {
    const docRef = doc(this.db, 'plannedRoutes', plannedRouteId);
    await updateDoc(docRef, {
      users: arrayUnion(userId)
    });
  }

  async removeUserFromPlannedRoute(plannedRouteId: string, userId: string): Promise<void> {
  const docRef = doc(this.db, 'plannedRoutes', plannedRouteId);
  await updateDoc(docRef, {
    users: arrayRemove(userId)
  });
}


}
