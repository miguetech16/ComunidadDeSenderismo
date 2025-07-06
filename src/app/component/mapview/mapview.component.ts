import { Component, AfterViewInit, Inject, PLATFORM_ID, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-mapview',
  standalone: true,
  templateUrl: './mapview.component.html',
  styleUrl: './mapview.component.css'
})
export class MapviewComponent implements AfterViewInit  {

  @Input() location: [number, number] = [28.0730822, -15.4530792]; // Default coordinates
  zoomLevel = 20;
  map: any;
  marker: any;

 constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then(L => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'assets/images/marker-icon-2x.png',
          iconUrl: 'assets/images/marker-icon.png',
          shadowUrl: 'assets/images/marker-shadow.png'
        });

        this.map = L.map('map-view').setView(this.location, this.zoomLevel);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Crear marcador inicial
        this.marker = L.marker(this.location).addTo(this.map).bindPopup('Ubicación de Ruta').openPopup();
        console.log('Coordenadas del marcador:' + this.location);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.map && this.marker) {
      this.updateMarker();
    }
  }

  updateMarker() {
    if (this.marker) {
      this.marker.setLatLng(this.location);
    } else {
      import('leaflet').then(L => {
        this.marker = L.marker(this.location).addTo(this.map).bindPopup('Ubicación de Ruta').openPopup();
      });
    }
    this.map.setView(this.location, this.zoomLevel);
  }
}
