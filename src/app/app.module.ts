import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

//Firebase
import { AngularFireAuthModule } from "@angular/fire/auth";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
