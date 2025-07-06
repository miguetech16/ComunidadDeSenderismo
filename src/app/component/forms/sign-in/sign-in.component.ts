import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { MaterialModule } from '../../../modules/material.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sign-in',
  imports: [ FormsModule, RouterModule, MaterialModule, ReactiveFormsModule, CommonModule], 
  providers: [AuthService ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})

export class SignInComponent {

  constructor(private router: Router, private auth: AuthService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)] )
  })

signIn() {
  if (this.form.valid) {
    this.auth.logIn(this.form.value.email as string, this.form.value.password as string)
      .then(() => {
        
        setTimeout(() => {
          const user = this.auth.getCurrentUser();
          console.warn('Usuario actual después de login:', user);
          if (user) {
            this.router.navigate(['user-profile', user.uid]);
          }
        }, 500); 
      })
      .catch((error) => {
        console.log('Error al loguear', error);
      });
  }
}


}