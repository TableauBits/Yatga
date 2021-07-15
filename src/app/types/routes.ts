import { Routes } from "@angular/router";
import { HomePageComponent } from "../components/home-page/home-page.component";
import { ProfilePageComponent } from "../components/profile-page/profile-page.component";
import { UsersPageComponent } from "../components/users-page/users-page.component";

export const ROUTES: Routes = [
  { path: '',         component: HomePageComponent },
  { path: 'profile',  component: ProfilePageComponent},
  { path: 'users',    component: UsersPageComponent }
]