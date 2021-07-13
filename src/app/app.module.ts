// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/auth";
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";

// MDB
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
//NO
//PLS
// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MdbDropdownModule,
  ],
  providers: [
    AuthService,
    { provide: PERSISTENCE, useValue: 'local' },  // Firebase login persitance
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
