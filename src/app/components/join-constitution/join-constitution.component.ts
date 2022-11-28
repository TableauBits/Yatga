import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { createMessage, CstResJoin, EventType, extractMessageData, Message } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { Status } from 'src/app/types/status';

@Component({
  selector: 'app-join-constitution',
  templateUrl: './join-constitution.component.html',
  styleUrls: ['./join-constitution.component.scss']
})
export class JoinConstitutionComponent implements OnDestroy {

  public errorStatus: Status;
	public joinForm: FormGroup;

  constructor(
    private auth: AuthService,
    private dialogRef: MatDialogRef<JoinConstitutionComponent>,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.joinForm = this.fb.group({
      id: [, Validators.required]
    });
    this.errorStatus = new Status();
    this.auth.pushEventHandler(this.handleEvents, this);
  }

  ngOnDestroy(): void {
		this.auth.popEventHandler();
	}

  handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
    if (message.event === EventType.CST_join) {
      const data = extractMessageData<CstResJoin>(message).status;
      if (data.success) {
        this.errorStatus.clearStatus();
        this.router.navigateByUrl(`/constitution/${this.joinForm.get('id')?.value}/songList`);
        this.closeWindow();
      } else {
        switch (data.status) {
          case "no_constitution":
            this.errorStatus.notify("ERREUR : La constitution demandée n'existe pas.", true);
            break;
        
          case "constitution_full":
            this.errorStatus.notify("ERREUR : La constitution demandée est déjà complète.", true);
            break;
          case "already_here":
            this.errorStatus.notify("ERREUR : Vous participez déjà à cette constitution.", true);
            break;
        }
        
      }
    }
	}

  sendRequest(): void {
    const cstID = this.joinForm.get('id')?.value;
    const joinConstitutionMessage = createMessage(EventType.CST_join, { id: cstID });
    this.auth.ws.send(joinConstitutionMessage);
  }

  closeWindow(): void {
		this.dialogRef.close();
	}

}
