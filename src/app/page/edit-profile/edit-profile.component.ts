import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { user } from '../../interfaces/user.interface';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-edit-profile',
  imports: [ CommonModule, FormsModule, MaterialModule, ReactiveFormsModule ],
  standalone: true,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  private userId!: string;
  protected userData: user | null = null;
  editProfileForm!: FormGroup;
  editUserDataForm!: FormGroup;
  newPasswordForm!: FormGroup;
  selectedImage: string = '';
  passwordsMatch: boolean | null = null;

  constructor(private userService: UserService, 
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private storage: StorageService,
              private router: Router,
              private notificationService: NotificationService,
              private auth: AuthService
  ) {}

    async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userid');

      if (id) {
        this.userId = id;
        this.userService.getUserData(this.userId).then(data => {
          this.userData = data;
          this.selectedImage = this.userData?.profilePicture || '';

        this.editProfileForm = this.formBuilder.group({
          username: [this.userData?.username, [Validators.minLength(3), Validators.maxLength(20)]],
          fullname: [this.userData?.fullname, [Validators.minLength(3), Validators.maxLength(20)]],
          profileDescription: [this.userData?.profileDescription, [Validators.maxLength(200)]],
          image: [this.userData?.profilePicture || ''],
          privateProfile: [this.userData?.isPrivate || false]
      });

        this.editUserDataForm = this.formBuilder.group({
          email: [this.userData?.email, [Validators.email]],
          phonenumber: [this.userData?.phonenumber, [Validators.pattern('^[0-9]{9}$')]],
        });

        });
      }
    });


    this.newPasswordForm = this.formBuilder.group({
      newpassword : ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async editProfile() {

    if (this.editProfileForm.valid) {

      if (this.selectedImage.length >= 500) {
        console.log('La imagen seleccionada esta en base64, subiendo');
        const fileName = `image_${Date.now()}_$;`;
        try {
          await this.storage.updateImages(fileName, "profile_pictures/", this.selectedImage);
          const url = await this.storage.getImageUrl(fileName, "profile_pictures/");
          this.selectedImage = url;
        }   catch (error) {
        console.error(`Error al subir la imagen:`, error);
        }
      } else {
        console.log("Imagen ya es una URL válida, no se subirá de nuevo.");
      }

      const updatedData = {
        uid: this.userId,
        username: this.editProfileForm.value.username,
        fullname: this.editProfileForm.value.fullname,
        profileDescription: this.editProfileForm.value.profileDescription,
        profilePicture: this.selectedImage,
        isPrivate: this.editProfileForm.value.privateProfile
      };

      this.userService.updateUserData(this.userId, updatedData).then(() => {
        console.log('Datos del perfil actualizados');

        const notification = {
          userId: this.userId,
          message: `¡${updatedData.username}, has actualizado tu perfil!`,
          timestamp: new Date(),
          read: false
        };

        this.notificationService.addNotification(notification);
        this.router.navigate(['user-profile', this.userId]);

      });

    } else {
      console.warn('Formulario de perfil no válido');
    }

  }

  editData() {

    if (this.editUserDataForm.valid){

      const newEmail = this.editUserDataForm.value.email;
      const newPhoneNumber = this. editUserDataForm.value.phonenumber;

      const newUserData = {
          uid: this.userData?.uid,
          username: this.userData?.username,
          fullname: this.userData?.fullname,
          phonenumber: newPhoneNumber,
          email: newEmail,
          isPrivate: this.userData?.isPrivate,
          profilePicture: this.userData?.profilePicture,
          profileDescription: this.userData?.profileDescription,
      }

      this.userService.updateUserData(this.userId, newUserData);
    }



  }

  changePassword() {

    if (this.newPasswordForm.valid) {
    const password = this.newPasswordForm.value.newpassword;
    const passwordConfirm = this.newPasswordForm.value.confirmpassword;

    if (password !== passwordConfirm) {
      console.log("Las contraseñas no coinciden");
      this.passwordsMatch = false;
      return;
    }

    this.auth.changePassword(password);
    this.newPasswordForm.reset();
    this.passwordsMatch = true;
  }
}

  newImage(event: any) {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) {
      console.warn('No se seleccionaron archivos');
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    const base64 = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    base64.then((result: string) => {
      this.selectedImage = result;
      console.log('Imagen seleccionada:', this.selectedImage);
    }).catch(error => {
      console.error('Error reading image file:', error);
    });

}
  }
