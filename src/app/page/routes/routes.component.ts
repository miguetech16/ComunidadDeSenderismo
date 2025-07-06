import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { MaterialModule } from '../../modules/material.module';
import { RouteSearcherComponent } from '../../component/searchers/route-searcher/route-searcher.component';
import { RouteCardComponent } from '../../component/cards/route-card/route-card.component';
import { CommonModule } from '@angular/common'; 
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-routes',
  imports: [ MaterialModule, RouteCardComponent, RouteSearcherComponent, CommonModule],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})

export class RoutesComponent implements OnInit {
  routes$!: Observable<any[]>;
  private searchTerm$ = new BehaviorSubject<string>(''); 

  constructor(private routeService: RouteService) {}

  ngOnInit(): void {
    const allRoutes$ = this.routeService.getRoutes();
        this.routes$ = combineLatest([
          allRoutes$,
          this.searchTerm$.asObservable()
        ]).pipe(
          map(([routes, term]) => {
            if (!term) return routes;
            return routes.filter(route =>
              route.title?.toLowerCase().includes(term)
            );
          })
        );
      }
    
      onSearchTermChanged(term: string) {
        this.searchTerm$.next(term);
    }
}
