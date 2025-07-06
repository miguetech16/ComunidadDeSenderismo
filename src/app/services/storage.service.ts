import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  async updateImages(image_name: string, image_folder: string, imgBase64: any)  {
    try {
      let response = await this.storage.ref(image_folder + image_name).putString(imgBase64, 'data_url');
      console.log('Imagen subida exitosamente:', response);

    } catch (error) {
      console.error('Error Subiendo imágenes', error);
    }
  }

  async getImageUrl(image_name: string, image_folder: string): Promise<string> {
    try {
      const url = await this.storage.ref(image_folder + image_name).getDownloadURL().toPromise();
      return url;
    } catch (error) {
      console.error('Error obteniendo la URL de la imagen', error);
      throw error;
    }
  }

}
