import {Component, inject, } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../modules/material.module';
import { StepperCustomComponent } from "../../component/forms/stepper-custom/stepper-custom.component";


@Component({
  selector: 'app-custom-routes',
  imports: [ MaterialModule, StepperCustomComponent],
  providers: [AuthService],
  templateUrl: './custom-routes.component.html',
  styleUrl: './custom-routes.component.css'
})
export class CustomRoutesComponent  {
 


}

