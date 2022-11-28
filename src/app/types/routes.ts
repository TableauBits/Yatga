import { Routes } from "@angular/router";
import { AdminPageComponent } from "../components/admin-page/admin-page.component";
import { ConstitutionComponent } from "../components/constitution-page/constitution.component";
import { CurrentConstitutionPageComponent } from "../components/current-constitution-page/current-constitution-page.component";
import { HomePageComponent } from "../components/home-page/home-page.component";
import { InvitePageComponent } from "../components/invite-page/invite-page.component";
import { ProfilePageComponent } from "../components/profile-page/profile-page.component";
import { UsersPageComponent } from "../components/users-page/users-page.component";

export const ROUTES: Routes = [
	{ path: '', 																component: HomePageComponent 								},
	{ path: 'admin-page', 											component: AdminPageComponent 							},
	{ path: 'constitution/:cstID/:section', 		component: ConstitutionComponent						},
	{ path: 'current-constitutions', 						component: CurrentConstitutionPageComponent },
	{	path: 'invite',														component: InvitePageComponent 							},
	{ path: 'profile', 													component: ProfilePageComponent 						},
	{ path: 'users', 														component: UsersPageComponent 							},
];
