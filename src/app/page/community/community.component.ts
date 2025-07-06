import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { UserCardComponent } from "../../component/cards/user-card/user-card.component";
import { UserSearcherComponent } from "../../component/searchers/user-searcher/user-searcher.component";
import { UserService } from '../../services/user.service';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { map, first} from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { PlannedCardComponent } from 'src/app/component/cards/planned-card/planned-card.component';
import { plannedRoute } from '../../interfaces/planned-route.interface'
import { PlannedRoutesService } from 'src/app/services/planned-routes.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  imports: [RouterModule, MaterialModule, UserCardComponent, PlannedCardComponent, UserSearcherComponent, CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit {

  private searchTerm$ = new BehaviorSubject<string>(''); 
  protected users$!: Observable<any[]>;
  protected plannedRoutes$!: Observable<plannedRoute[]>;
  protected openPlannedRoutes$!: Observable<plannedRoute[]>;
  protected openPlannedRoutes: plannedRoute[] = [];
  protected currentUserId!: string;

  constructor(private userService: UserService,
              private plannedRouteService: PlannedRoutesService,
              private authService: AuthService,
              private router: Router
  ) {}

async ngOnInit(): Promise<void> {
  this.authService.getCurrentUser$().pipe(first()).subscribe(user => {
    if (!user) return;
    this.currentUserId = user.uid;

    const filteredUsers$ = this.userService.getUsers().pipe(
      map(users => users.filter(u => u.uid !== this.currentUserId))
    );

    this.users$ = combineLatest([
      filteredUsers$,
      this.searchTerm$.asObservable()
    ]).pipe(
      map(([users, term]) => {
        if (!term) return users;
        return users.filter(u =>
          u.username?.toLowerCase().includes(term.toLowerCase())
        );
      })
    );

    this.openPlannedRoutes$ = from(this.plannedRouteService.getAllPlannedRoutes()).pipe(
      map(routes => routes.filter(r => r.planType === true))
    );
  });
}


  onSearchTermChanged(term: string) {
    this.searchTerm$.next(term);
  }
}
