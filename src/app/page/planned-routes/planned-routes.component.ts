import {Component, OnInit} from '@angular/core';
import { StepperPlannedComponent } from '../../component/forms/stepper-planned/stepper-planned.component';
import { MaterialModule } from '../../modules/material.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planned-routes',
  imports: [ MaterialModule,  StepperPlannedComponent],
  providers: [],
  templateUrl: './planned-routes.component.html',
  styleUrl: './planned-routes.component.css',
})

export class PlannedRoutesComponent implements OnInit{

  routeId: string = '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.routeId = this.route.snapshot.paramMap.get('routeid') ?? '';
    if (this.routeId) {
      console.log("Ruta Seleccionada: ", this.routeId);
      this.routeId = this.route.snapshot.paramMap.get('routeid') ?? '';
    } else {
      console.log("No hay ruta seleccionada");
    }
  }

}

  
