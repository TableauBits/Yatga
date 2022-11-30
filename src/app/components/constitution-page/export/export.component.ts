import { Component, Input } from '@angular/core';
import { Constitution, EMPTY_CONSTITUTION, Role, Song, User } from 'chelys';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadService } from 'src/app/services/download.service';
import { compareObjectsFactory } from 'src/app/types/utils';

type ExportJSON = {
  cstName: string;
  date: string;
  songs: Song[];
}

type ExportFormat = {
  format: ExportValue;
  name: string;
  isDev: boolean;
}

enum ExportValue {
  NO_FORMAT,
  CSV,
  CSV_DEV,
  JSON,
  JSON_DEV,
  GOOGLE_SHEETS,
}

const FORMATS: ExportFormat[] = [
  {
    format: ExportValue.CSV,
    name: 'CSV',
    isDev: false
  },
  {
    format: ExportValue.CSV_DEV,
    name: 'CSV (dev)',
    isDev: true
  },
  {
    format: ExportValue.GOOGLE_SHEETS,
    name: 'Google Sheets',
    isDev: false
  },
  {
    format: ExportValue.JSON,
    name: 'JSON',
    isDev: false
  },
  {
    format: ExportValue.JSON_DEV,
    name: 'JSON (dev)',
    isDev: true
  }
];

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  @Input() constitution: Constitution = EMPTY_CONSTITUTION;
  @Input() users: Map<string, User> = new Map();
	@Input() songs: Map<number, Song> = new Map();

  availableFormat: ExportFormat[];
  selectedFormat: ExportValue;

  constructor(private auth: AuthService, private dwl: DownloadService) {
    this.selectedFormat = ExportValue.NO_FORMAT;

    if (!this.auth.user.roles.includes(Role.DEV)) {
      this.availableFormat = FORMATS.filter((f) => !f.isDev);
    } else this.availableFormat = FORMATS;

  }

  getUsername(uid: string): string {
    return this.users.get(uid)?.displayName || "";
  }

  correctCSVField(field: string): string {
    return field.includes(',') ? `"${field}"` : field;
  }

  toGoogleSheets(songs: Song[]): string {
    return songs.map((song) => `=HYPERLINK("${song.url}"; "${song.title}")`).join("\n");
  }

  toCSV(songs: Song[], devFormat: boolean): string {
    if (devFormat) {
      return Object.keys(songs[0]).sort().join(",") + "\n" + songs.map((song) => {
        return Object.entries(song)
          .sort()
          .map((v) => this.correctCSVField(String(v[1])))
          .join(",");
      }).join("\n");
    } else {
      return "author,title,url,user\n" + songs.map((song) => {
        return `${this.correctCSVField(song.author)},${this.correctCSVField(song.title)},${this.correctCSVField(song.url)},${this.correctCSVField(this.getUsername(song.user))}`;
      }).join("\n");
    }
  }

  toJSON(obj: ExportJSON, devFormat: boolean): string {
    if (!devFormat) {
      obj.songs = obj.songs.map((s) => {
        return {
          ...s,
          user: this.getUsername(s.user)
        };
      });
    }
    return JSON.stringify(obj);
  }

  download() {
    const songs = Array.from(this.songs.values()).sort(compareObjectsFactory("id", false));
    switch (Number(this.selectedFormat)) {
      case ExportValue.CSV:
      case ExportValue.CSV_DEV:
        this.dwl.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name + ".csv",
          text: this.toCSV(songs, Number(this.selectedFormat) === ExportValue.CSV_DEV)
        });
        break;
      case ExportValue.JSON:
      case ExportValue.JSON_DEV:
        const obj = {
          cstName: this.constitution.name,
          date: new Date().toISOString(),
          songs
        };
        this.dwl.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name + ".json",
          text: this.toJSON(obj, Number(this.selectedFormat) === ExportValue.JSON_DEV)
        });
        break;
      case ExportValue.GOOGLE_SHEETS:
        this.dwl.dyanmicDownloadByHtmlTag({
          fileName: this.constitution.name + ".txt",
          text: this.toGoogleSheets(songs)
        });
        break;
    }
  }

}
