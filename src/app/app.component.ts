import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { MaterialModule } from './modules/material.module';
import { IonContent, IonApp, IonHeader, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
  imports: [ IonContent, IonApp, CommonModule, RouterModule, MaterialModule, HeaderComponent, FooterComponent],
})


export class AppComponent {
  title = 'ComunidadDeSenderismo';
}
