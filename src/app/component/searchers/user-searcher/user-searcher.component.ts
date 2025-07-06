import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-searcher',
  imports: [ MaterialModule, CommonModule],
  templateUrl: './user-searcher.component.html',
  styleUrls: ['./user-searcher.component.css']
})
export class UserSearcherComponent {
  @Output() searchTerm = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onSearch(input.value);
  }


  onSearch(value: string) {
    this.searchTerm.emit(value.toLowerCase());
  }
}
