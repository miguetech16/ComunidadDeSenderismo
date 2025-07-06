import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, collection, doc, setDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private db: Firestore) {}

  getRoutes(): Observable<any[]> {
    const routesCollection = collection(this.db, 'routes');
    return collectionData(routesCollection, { idField: 'id' });
  }

  getRouteById(id: string): Observable<any> {
    const routeDoc = doc(this.db, `routes/${id}`);
    return docData(routeDoc, { idField: 'id' });
  }

getRoutesByUser(userId: string): Observable<any[]> {
  const routesRef = collection(this.db, 'routes');
  const q = query(routesRef, where('userId', '==', userId));
  return collectionData(q, { idField: 'id' });
}

  getTimeByRoute(routeDistance: number): string  {
  const speedKmH = 5; 

  const totalHours = routeDistance / speedKmH;
  const totalSeconds = totalHours * 3600;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');

}

  addRoute(route: any): Promise<string> {
    const routesCollection = collection(this.db, 'routes');
    const newDocRef = doc(routesCollection);
    return setDoc(newDocRef, route).then(() => newDocRef.id);
  }

  updateRoute(id: string, route: any): Promise<void> {
    const routeDoc = doc(this.db, `routes/${id}`);
    return setDoc(routeDoc, route);
  }

  deleteRoute(id: string): Promise<void> {
    const routeDoc = doc(this.db, `routes/${id}`);
    return deleteDoc(routeDoc);
  }


}