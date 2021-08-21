import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@tableaubits/hang';
import { AuthService } from 'src/app/services/auth.service';

export enum AdminSection {
  NEW_CONSTITUTION,
  NO_SECTION
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {

  public isAdmin: boolean;
  public isDev: boolean;
  public currentSection: AdminSection;

  constructor(public auth: AuthService, private router: Router) {
    this.isDev = false; 
    this.isAdmin = false;
    this.currentSection = AdminSection.NO_SECTION;

    this.auth.waitForAuth(() => { }, this.onConnect, this);
  }

  private onConnect(): void {
    // redirect unauthorized user
    this.isDev = this.auth.user.roles.includes(Role.DEV);
    this.isAdmin = this.auth.user.roles.includes(Role.ADMIN);
    if (!this.isDev && !this.isAdmin) this.router.navigate(['']);
	}

  changeSection(newSection: AdminSection) {
    this.currentSection = newSection;
  }

}
