import { Component } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { MaterialModule } from '../../../modules/material.module';
import { MapComponent } from '../../map/map.component';
import { RouteService } from '../../../services/route.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/storage.service';
import { NotificationService } from '../../../services/notification.service'; 
import { UserService } from '../../../services/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-stepper-custom',
    imports: [ MaterialModule, FormsModule, ReactiveFormsModule, MapComponent, CommonModule],
    providers: [],
    standalone: true,
  templateUrl: './stepper-custom.component.html',
  styleUrl: './stepper-custom.component.css'
})
export class StepperCustomComponent {

  routeForm!: FormGroup;
  updatedImages: string[] = [];
  selectedImages: string[] = [];
  difficultyMap = {
      '1': 'Fácil',
      '2': 'Intermedio',
      '3': 'Difícil',
      '4': 'Extrema'
      };
   updated = true;
   selectedCoordsFromMap: [number, number] | null = null;
    
constructor(
  private formBuilder: FormBuilder, 
  private routeService: RouteService,
  private auth: AuthService,
  private router: Router,
  private storage: StorageService,
  private notificationService: NotificationService,
  private userService: UserService) {}

ngOnInit() {
this.routeForm = this.formBuilder.group({
  title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
  description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
  ubication1: ['', [Validators.required, Validators.maxLength(15)]],
  ubication2: ['', [Validators.required, Validators.maxLength(15)]],
  ubication3: ['', [Validators.required, Validators.maxLength(15)]],
  recommendations: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
  distance: ['', [Validators.required, Validators.min(0.01), Validators.max(1000), Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
  difficulty: ['', [Validators.required]]
});

}

async submitRoute() {
  if (this.routeForm.valid) {
    const user = this.auth.getCurrentUser();
    const routeData = this.routeForm.value;
    routeData.difficulty = this.difficultyMap[routeData.difficulty as keyof typeof this.difficultyMap];

    // Bloquea el botón mientras sube imágenes
    this.updated = false;

    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < this.selectedImages.length; i++) {
      const base64 = this.selectedImages[i];
      const fileName = `image_${Date.now()}_${i}`;

      try {
        await this.storage.updateImages(fileName, "route_pictures/", base64);
        const url = await this.storage.getImageUrl(fileName, "route_pictures/");
        uploadedImageUrls.push(url);
      } catch (error) {
        console.error(`Error al subir la imagen ${i}:`, error);
      }
    }

const newRoute = {
  title: routeData.title,
  description: routeData.description,
  ubication: [
    routeData.ubication1,
    routeData.ubication2,
    routeData.ubication3
  ],
  location: this.selectedCoordsFromMap
    ? { lat: this.selectedCoordsFromMap[0], lng: this.selectedCoordsFromMap[1] }
    : null,
  recommendations: routeData.recommendations,
  distance: routeData.distance,
  difficulty: routeData.difficulty,
  userId: user?.uid,
  images: uploadedImageUrls
};
    this.routeService.addRoute(newRoute)
      .then(async (docId: string) => {
        console.log('Ruta creada exitosamente:', docId);

      if (user && user.uid) {
  const userData = await this.userService.getUserData(user.uid);
  const followers = await firstValueFrom(this.userService.getFollowers(user.uid));

for (const follower of followers) {
  const notification = {
    userId: follower.id, // 👈 usa `id` porque usaste { idField: 'id' }
    message: `¡${userData?.username || 'Un usuario'} ha creado una nueva ruta: ${newRoute.title}!`,
    timestamp: new Date(),
    read: false
  };
  console.log(`Notificando al seguidor: ${follower.id}`);
  await this.notificationService.addNotification(notification);
}
}
        this.router.navigate(['routes']);
      })
      .catch((error: any) => {
        console.error('Error al crear la ruta:', error);
      })
      .finally(() => {
        this.updated = true;
      });
  } else {
    console.log('Formulario inválido');
  }
}


async saveImages(event: any) {
  const files: FileList = event.target.files;

  if (this.selectedImages.length >= 4) {
    console.warn('No puedes subir más de 4 imágenes.');
    return;
  }

  const filesToProcess = Math.min(files.length, 4 - this.selectedImages.length);

  for (let i = 0; i < filesToProcess; i++) {
    const file = files[i];
    const reader = new FileReader();

    const base64: string = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    this.selectedImages.push(base64);
  }
}

onCoordinatesSelected(coords: [number, number]) {
  console.log('Coordenadas recibidas:', coords);
  this.selectedCoordsFromMap = coords;
}



}
