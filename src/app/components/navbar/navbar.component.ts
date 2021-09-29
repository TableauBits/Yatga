import { Component } from '@angular/core';
import { Role } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

	constructor(public auth: AuthService) {
	}

	isAuthorized(): boolean {
		return this.auth.user.roles.includes(Role.ADMIN);
	}
}
