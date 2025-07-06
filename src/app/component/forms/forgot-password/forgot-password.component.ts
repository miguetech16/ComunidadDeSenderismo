import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MailService } from 'src/app/services/mail.service';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})

export class ForgotPasswordComponent  {

  constructor(
    private router: Router,
    private UserService: UserService,
    private mailService: MailService
  ) { }

  currentUser: any;
  emailMsg: boolean = false;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });


  async changePassword() {
    if(this.form.valid){
      this.UserService.getUsers().subscribe(users => {
        for (let user of users) {
          if (user.email == this.form.value.email){
              this.mailService.sendPasswordResetEmail(this.form.value.email!);
              this.emailMsg = true;
              console.log("Correo Encontrado");
              return;
          }
        }
        this.emailMsg = true;
        console.log("Correo NO Encontrado");
      });
    }
  }

}
