import { Component, OnDestroy } from '@angular/core';
import { Song, Invite } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-manage-invites',
  templateUrl: './manage-invites.component.html',
  styleUrls: ['./manage-invites.component.scss']
})
export class ManageInvitesComponent implements OnDestroy {

  public invites: Invites[] = [];

  constructor(private auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
		this.auth.pushEventHandler(this.handleEvents, this);
  }

  ngOnDestroy() {
    this.auth.popEventHandler();
		this.auth.popAuthCallback();
  }

  private handleEvents(event: MessageEvent<any>): void {}

  private onConnect(): void {}

}
