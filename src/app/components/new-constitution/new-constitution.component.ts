import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnonymousLevel, ConstitutionType } from '@tableaubits/hang';
import { isNumber } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-constitution',
  templateUrl: './new-constitution.component.html',
  styleUrls: ['./new-constitution.component.scss']
})
export class NewConstitutionComponent  {

  public newConstitutionForm: FormGroup;

  constructor(public auth: AuthService, public fb: FormBuilder) {
    this.newConstitutionForm = this.fb.group({
      season: [, Validators.required],
      part: [, Validators.required],
      name: ["", Validators.required],
      isPublic: [true, Validators.required],
      anonymousLevel: [AnonymousLevel.PUBLIC, Validators.required],
      type: [ConstitutionType.GRADE, Validators.required],
      playlistLink: ["", Validators.required],
      maxUserCount: [4, Validators.required],
      numberOfSongsPerUser: [1, Validators.required],
    })
  }

  public getTypes(): string[] {
    return Object.keys(ConstitutionType).filter((key) => isNaN(key as unknown as number)).splice(0, ConstitutionType.LENGTH);
  }

}
