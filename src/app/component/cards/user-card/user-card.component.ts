import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {

  @Input() user: any;

}
