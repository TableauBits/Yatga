
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Constitution, createMessage, CstReqGet, CstResUpdate, EventType, extractMessageData, Message, Role, Song, User, UsrReqGet, UsrReqUnsubscribe, UsrResUpdate } from '@tableaubits/hang';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY_CONSTITUTION, OWNER_INDEX } from 'src/app/types/constitution';
import { ManageSongsComponent } from '../manage-songs/manage-songs.component';

enum ConstitutionSection {
  SONG_LIST,
  VOTES,
  OWNER,
  RESULTS,
  EXPORT
}

@Component({
  selector: 'app-constitution',
  templateUrl: './constitution.component.html',
  styleUrls: ['./constitution.component.scss']
})
export class ConstitutionComponent {

  private cstID = "";
  constitution: Constitution;
  users: Map<string, User>;
  currentSection: ConstitutionSection;
  songs: Song[];

  constructor(
    private auth: AuthService, 
    private route: ActivatedRoute,
    private dialog: MatDialog
  ){
    this.constitution = EMPTY_CONSTITUTION;
    this.currentSection = ConstitutionSection.SONG_LIST;
    this.users = new Map();
    this.auth.waitForAuth(this.handleEvents, this.onConnect, this);
    this.songs = [];
  }

  // HTML can't access the ConstiutionSection enum directly
  public get constitutionSection(): typeof ConstitutionSection {
    return ConstitutionSection; 
  }

  private onConnect(): void {
    this.route.params.subscribe((params) => {
      this.cstID = params.cstID;  // TODO : check if user is a member of the constitution and redirect him

      const getCSTMessage = createMessage<CstReqGet>(EventType.CST_get, {ids: [this.cstID]})
      this.auth.ws.send(getCSTMessage);
    })
  }

  private handleEvents(event: MessageEvent<any>): void {
    let message = JSON.parse(event.data.toString()) as Message<unknown>;
    
    switch (message.event) {
      case EventType.CST_update: {
        const data = extractMessageData<CstResUpdate>(message).cstInfo;
        if (data.id === this.cstID) {
          this.constitution = data;

          const newUsers = this.constitution.users.filter((uid) => !this.users.has(uid));
          const unusedListens = Array.from(this.users.values()).filter((user) => !this.constitution.users.includes(user.uid)).map((user) => user.uid);
          for (const uid of unusedListens) {
            this.users.delete(uid)
          }

          const getUsersMessage = createMessage<UsrReqGet>(EventType.USER_get, {uids: newUsers})
          this.auth.ws.send(getUsersMessage);
          const unsubscribeUsersMessage = createMessage<UsrReqUnsubscribe>(EventType.USER_unsubscribe, {uids: unusedListens});
          this.auth.ws.send(unsubscribeUsersMessage);
        } 
      }
        break;
      case EventType.USER_update: {
        const data = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(data.uid, data)
      }
        break;
      // TODO : songs
    }
  }

  openDialogManageSongs(): void {
    // const config = new MatDialogConfig;
    this.dialog.open(ManageSongsComponent);
  }

  setCurrentSection(newSection: ConstitutionSection): void {
    this.currentSection = newSection;
  }

  isSectionActive(section: ConstitutionSection): boolean {
    return section === this.currentSection;
  } 

  isOwner(user?: User): boolean {
    if (user) return user.uid === this.constitution.users[OWNER_INDEX];
    else return this.auth.uid === this.constitution.users[OWNER_INDEX];
  }
  
  isAdmin(user: User): boolean {
    return user.roles.includes(Role.ADMIN);
  }

  getUsers(): User[] {
    return Array.from(this.users.values());
  }
}
