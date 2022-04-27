import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { JoinConstitutionComponent } from '../join-constitution/join-constitution.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

	constructor(public auth: AuthService, private dialog: MatDialog) {}

	isAuthorized(): boolean {
		return this.auth.user.roles.includes(Role.ADMIN);
	}

	openJoinConstitution(): void {
		this.dialog.open(JoinConstitutionComponent);
	}
}
