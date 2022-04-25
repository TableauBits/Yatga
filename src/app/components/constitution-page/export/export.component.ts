// Source : https://stackblitz.com/edit/httpsstackoverflowcomquestions51806464how-to-create-and-downloa?file=src%2Fapp%2Fapp.component.ts
import { Component, Input } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, Song, User } from 'chelys';

enum ExportFormat {
  NO_FORMAT,
  CSV,
  GOOGLE_SHEETS,
  
}

const FORMATS = [
  {
    format: ExportFormat.CSV,
    name: 'CSV'
  },
  {
    format: ExportFormat.GOOGLE_SHEETS,
    name: 'Google Sheets'
  }
]

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  availableFormat = FORMATS;
  selectedFormat: ExportFormat;

  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement
    }
  }

  constructor() {
    this.selectedFormat = ExportFormat.NO_FORMAT;
  }

  getUsername(uid: string): string {
    return this.users.get(uid)?.displayName || "";
  }

  correctCSVField(field: string): string {
    return field.includes(',') ? `"${field}"` : field;
  }

  toGoogleSheets(): string {
    return Array.from(this.songs.values()).map((song) => `=HYPERLINK("${song.url}"; "${song.title}")`).join("\n")
  }

  toCSV(): string {
    const header = "Title,Author,URL,User\n";

    return header + Array.from(this.songs.values()).map((song) => {
      return `${this.correctCSVField(song.title)},${this.correctCSVField(song.author)},${this.correctCSVField(song.url)},${this.correctCSVField(this.getUsername(song.user))}`;
    }).join("\n")
  }

  download() {
    switch (Number(this.selectedFormat)) {
      case ExportFormat.CSV: 
        this.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name + ".csv",
          text: this.toCSV()
        })
        break;
      case ExportFormat.GOOGLE_SHEETS:
        this.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name + ".txt",
          text: this.toGoogleSheets()
        })
        break;
    }
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}
