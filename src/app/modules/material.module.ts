import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import { MatDivider} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  exports: [MatButtonModule, MatInputModule, MatToolbarModule, MatCardModule, MatIconModule, MatLabel, MatFormField, MatButton, MatSelectModule, MatDatepickerModule, MatCalendar, MatFormFieldModule, MatRadioModule, MatButton, MatDivider, MatMenuModule, MatProgressSpinnerModule],
  imports: [MatButtonModule, MatInputModule, MatToolbarModule, MatCardModule, MatIconModule, MatLabel, MatFormField, MatButton, MatSelectModule, MatDatepickerModule, MatCalendar, MatFormFieldModule, MatRadioModule, MatButton, MatDivider, MatMenuModule, MatProgressSpinnerModule], 
  providers: [provideNativeDateAdapter()] 

})
export class MaterialModule {}
