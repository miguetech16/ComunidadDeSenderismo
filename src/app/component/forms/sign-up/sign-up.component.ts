import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MaterialModule } from '../../../modules/material.module'; 
import { UserService } from '../../../services/user.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, MaterialModule, CommonModule],
  providers: [AuthService],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SignUpComponent {

  constructor(
    private userService: UserService, 
    private auth: AuthService,
    private notificationService: NotificationService) {}

  router = inject(Router);
  mat = inject(MaterialModule);

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9_]+$') ]),
    fullname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]), 
    phonenumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9,15}$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') ] )
  })

async signUp() {
  if (this.form.valid) {
    try {
      const formValue = this.form.value;

      const response = await this.auth.register({
        email: formValue.email!,
        password: formValue.password!
      });

      const uid = response.user.uid;

      // Guardar los datos del usuario en Firestore sin contraseña
      const userData = {
        uid,
        username: formValue.username!,
        fullname: formValue.fullname!,
        phonenumber: formValue.phonenumber!,
        email: formValue.email!,
        profilePicture: '',
        isPrivate: false,
        profileDescription: ''
      };

      const newUser = await this.userService.addUser(uid, userData);
      console.log('Usuario registrado', newUser);
      this.router.navigate(['routes']);

      const notification = {
        userId: uid,
        message: '¡Bienvenido a la comunidad de senderismo!',
        timestamp: new Date(),
        read: false
      };

      this.notificationService.addNotification(notification);

    } catch (error) {
      console.error('Usuario no registrado', error);
    }
  }
}
   
}


