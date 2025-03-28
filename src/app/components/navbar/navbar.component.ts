import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { JoinConstitutionComponent } from '../join-constitution/join-constitution.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OnInit } from '@angular/core';
@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
	isSmallScreen = false;
	constructor(
		public auth: AuthService,
		private dialog: MatDialog,
		private breakpointObserver: BreakpointObserver
	) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Handset])
			.subscribe((result) => {
				this.isSmallScreen = result.matches;
			});
	}

	isAuthorized(): boolean {
		return this.auth.user.roles.includes(Role.ADMIN);
	}

	openJoinConstitution(): void {
		this.dialog.open(JoinConstitutionComponent);
	}

	navigateTo(url: string) {
		window.open(url, '_blank');
	}
}
