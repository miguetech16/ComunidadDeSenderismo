import { Component, AfterViewInit, Inject, PLATFORM_ID, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  @Output() coordinatesSelected = new EventEmitter<[number, number]>();

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

      const defaultCoords: [number, number] = [28.0730822, -15.4530792];
      const zoomLevel = 20;

      const map = L.map('mi_mapa', {
        zoomControl: true,
        attributionControl: true,
      }).setView(defaultCoords, zoomLevel);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      let currentMarker: L.Marker | null = null;

      // Geoloc
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];
            map.setView(userCoords, zoomLevel);
            currentMarker = L.marker(userCoords).addTo(map).bindPopup('Tu ubicación').openPopup();
          },
          () => {
            currentMarker = L.marker(defaultCoords).addTo(map).bindPopup('Ubicación por defecto').openPopup();
          }
        );
      } else {
        currentMarker = L.marker(defaultCoords).addTo(map).bindPopup('Ubicación por defecto').openPopup();
      }

      // Evento click para seleccionar coordenadas
      map.on('click', (e: L.LeafletMouseEvent) => {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng];

        if (currentMarker) {
          map.removeLayer(currentMarker);
        }
        currentMarker = L.marker(coords).addTo(map).bindPopup('Ubicación seleccionada').openPopup();
        this.coordinatesSelected.emit(coords);
      });


      setTimeout(() => {
        map.invalidateSize();
      }, 100); 
    });
  }
}

}