import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/modules/material.module';
import { AuthService } from 'src/app/services/auth.service';
import { PlannedRoutesService } from 'src/app/services/planned-routes.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planned-invite',
  templateUrl: './planned-invite.component.html',
  imports: [MaterialModule],
  styleUrls: ['./planned-invite.component.scss'],
})
export class PlannedInviteComponent  implements OnInit {

  constructor(private plannedRouteService: PlannedRoutesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const currentuserid = this.authService.getCurrentUser()?.uid || '';

    if (!currentuserid){
      this.router.navigate(["sign-in"]);
    }

    const plannedId = this.route.snapshot.paramMap.get('plannedid');

    if (plannedId) {
      this.plannedRouteService.addUserToPlannedRoute(plannedId, currentuserid)
        .then(() => this.router.navigate(["planned-view", plannedId]))
        .catch(() => this.router.navigate(["not-found"]));
    }
  
  }

}
