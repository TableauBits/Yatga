import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-grade-navigator',
  templateUrl: './grade-navigator.component.html',
  styleUrls: ['./grade-navigator.component.scss']
})
export class GradeNavigatorComponent {

  constructor(
    private sanitizer: DomSanitizer,
		private dialogRef: MatDialogRef<GradeNavigatorComponent>
  ) { }

  closeWindow(): void {
		this.dialogRef.close();
	}

}
