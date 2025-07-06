import { Component, EventEmitter, Output} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../modules/material.module';

@Component({
  selector: 'app-route-searcher',
  imports: [ RouterModule, MaterialModule],
  templateUrl: './route-searcher.component.html',
  styleUrl: './route-searcher.component.css'
})
export class RouteSearcherComponent {
  @Output() searchTerm = new EventEmitter<string>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onSearch(input.value);
  }

  onSearch(value: string) {
    // console.log('[RouteSearcherComponent] Emitiendo término de búsqueda:', value);
    this.searchTerm.emit(value.toLowerCase());
  }
}