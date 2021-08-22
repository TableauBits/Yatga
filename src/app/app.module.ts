// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field'

// Angular Fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, PERSISTENCE } from "@angular/fire/auth";
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { CurrentConstitutionPageComponent } from './components/current-constitution-page/current-constitution-page.component';
import { ConstitutionComponent } from './components/constitution/constitution.component';

// Material
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from '@angular/material/checkbox'
 
// MDB
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { AuthService } from './services/auth.service';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { NewConstitutionComponent } from './components/admin-page/new-constitution/new-constitution.component';


@NgModule({
	declarations: [
		AppComponent,
		ProfilePageComponent,
		NavbarComponent,
		HomePageComponent,
		UsersPageComponent,
		CurrentConstitutionPageComponent,
  ConstitutionComponent,
  AdminPageComponent,
  NewConstitutionComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		TextFieldModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatSliderModule,
		MatTooltipModule,
		MatCheckboxModule,
		MdbDropdownModule,
		MdbCollapseModule,
	],
	providers: [
		AuthService,
		{ provide: PERSISTENCE, useValue: 'local' },  // Firebase login persitance
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
