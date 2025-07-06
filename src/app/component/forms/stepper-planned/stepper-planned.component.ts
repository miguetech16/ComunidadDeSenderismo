import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { RouteSearcherComponent } from "../../searchers/route-searcher/route-searcher.component";
import { RouteCardComponent } from "../../cards/route-card/route-card.component";
import { RouteService } from '../../../services/route.service';
import { Observable, firstValueFrom, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { PlannedRoutesService } from '../../../services/planned-routes.service';
import { plannedRoute } from '../../../interfaces/planned-route.interface';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stepper-planned',
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, RouteSearcherComponent, RouteCardComponent],
  templateUrl: './stepper-planned.component.html',
  styleUrl: './stepper-planned.component.css'
})

export class StepperPlannedComponent implements OnInit, OnChanges {

  @Input() routeId: string | null = null;
  routes$!: Observable<any[]>;
  form!: FormGroup;
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  private searchTerm$ = new BehaviorSubject<string>(''); 

    constructor(
    private routeService: RouteService,
    private userService: UserService,
    private plannedRouteService: PlannedRoutesService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
  const allRoutes$ = this.routeService.getRoutes();

  this.routes$ = combineLatest([
    allRoutes$,
    this.searchTerm$
  ]).pipe(
    map(([routes, term]) => {
      if (!term) return routes;
            return routes.filter(route =>
              route.title?.toLowerCase().includes(term.trim().toLowerCase()) 
            );
    })
  );

  this.form = new FormGroup({
    selectedRoute: new FormControl('', Validators.required),
    selectedDate: new FormControl('', [Validators.required]),
    selectedTime: new FormControl('', [
      Validators.required,
      Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    ]),
    planType: new FormControl('', Validators.required)
  });

  this.selectRouteFromInput();
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['routeId'] && !changes['routeId'].firstChange) {
      this.selectRouteFromInput();
    }
  }

  private selectRouteFromInput() {
    if (this.routeId && this.form) {
      this.form.get('selectedRoute')?.setValue(this.routeId);
    }
  }

  onSearchTermChanged(term: string) {
    console.log('[StepperPlannedComponent] Recibido término de búsqueda:', term);
    this.searchTerm$.next(term);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const currentUser = await this.userService.getCurrentUserData();

      if (!currentUser) {
        console.error('No se pudo obtener el usuario actual');
        return;
      }

      
      const route = await firstValueFrom(this.routeService.getRouteById(this.form.value.selectedRoute));

      const plannedRoute: Omit<plannedRoute, 'id' | 'users'> & { users: string[] } = {
        routeId: this.form.value.selectedRoute,
        plannedRouteTitle: route.title,
        creatorName: currentUser.username || '',
        creatorAvatar: currentUser.profilePicture || 'images/default-profile.png',
        routePicture: route.images?.[0] || '',
        date: this.form.value.selectedDate,
        hour: this.form.value.selectedTime,
        planType: this.form.value.planType,
        creatorId: currentUser.uid,
        users: [currentUser.uid]
      };

      const docRef = await this.plannedRouteService.createPlannedRoute(plannedRoute);
      console.log('Ruta planificada creada con ID:', docRef.id);

      const notification = {
          userId: currentUser.uid,
          message: `¡Nueva ruta planeada: ${route.title}!`,
          timestamp: new Date(),
          read: false
        };

        this.notificationService.addNotification(notification);

      this.router.navigate(['routes']);

    } catch (error) {
      console.error('Error al crear la ruta planificada:', error);
    }
  }

}
