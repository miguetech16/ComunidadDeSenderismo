import { Component, Input} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-route-card',
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './route-card.component.html',
  styleUrl: './route-card.component.css'
})

export class RouteCardComponent {

@Input() route: any;

onToggleFavorite(route: string) {}

isFavorite(route: string): boolean {
  // TODO: Implement actual favorite logic
  return false;
}

}

