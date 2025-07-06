import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { setLogLevel, LogLevel } from '@angular/fire';


setLogLevel(LogLevel.SILENT);
bootstrapApplication(AppComponent, appConfig);


