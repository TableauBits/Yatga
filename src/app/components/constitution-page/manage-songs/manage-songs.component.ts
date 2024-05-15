import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMessage, CstSongReqAdd, CstSongReqRemove, CstSongResUpdate, EventType, extractMessageData, Message, Song, SongPlatform, SONG_AUTHOR_LENGTH, SONG_NAME_LENGTH } from 'chelys';
import { isEmpty, isNil, isNull } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { Status } from 'src/app/types/status';
import { URLToSongPlatform } from 'src/app/types/url';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { keepUniqueValues, removeElementFromArray } from 'src/app/types/utils';
import { ALL_GENRES, ALL_LANGUAGES_FR, INSTRUMENTAL_CODE, LANGUAGES_FR_TO_CODE } from 'src/app/types/song-utils';
import { ICONS_PATH } from 'src/app/types/icon';
import { SEARCH_HELPERS, SearchHelper, SearchQuery } from 'src/app/types/search-helper';

interface ManageSongsInjectedData {
	cstID: string;
	songs: Map<number, Song>;
}

@Component({
	selector: 'app-manage-songs',
	templateUrl: './manage-songs.component.html',
	styleUrls: ['./manage-songs.component.scss']
})
export class ManageSongsComponent implements OnDestroy {

	public songs: Map<number, Song>;
	public newSongForm: FormGroup;
	public errorStatus: Status;
	private cstID: string;

	public altTitles: string[];
	
	public genres: string[];
	public filteredGenres: Observable<string[]>;
	private allGenres: string[];
	public genresForm: FormControl;
	@ViewChild('genreInput') genreInput!: ElementRef<HTMLInputElement>;

	public languages: string[];
	public filteredLanguages: Observable<string[]>;
	private allLanguages: string[];
	public languagesForm: FormControl;
	@ViewChild('languageInput') languageInput!: ElementRef<HTMLInputElement>;

	constructor(
		private auth: AuthService,
		private dialogRef: MatDialogRef<ManageSongsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: ManageSongsInjectedData,
		public fb: FormBuilder
	) {
		this.cstID = data.cstID;
		this.songs = data.songs;
		this.altTitles = [];
		this.genres = [];
		this.languages = [];
		this.allLanguages = ALL_LANGUAGES_FR.sort();
		this.allGenres = ALL_GENRES;
		this.genresForm = new FormControl();
		this.languagesForm = new FormControl();
		this.newSongForm = this.fb.group({
			title: [, Validators.required],
			author: [, Validators.required],
			url: [, Validators.required],
			album: [],
			releaseYear: [],
			isInstrumental: [false]
		});

		this.filteredGenres = this.genresForm.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => (genre ? this._filter(genre, "genres") : this.allGenres.slice())),
    );

		this.filteredLanguages = this.languagesForm.valueChanges.pipe(
      startWith(null),
      map((langage: string | null) => (langage ? this._filter(langage, "languages") : this.allLanguages.slice())),
    );

		this.errorStatus = new Status();
		this.auth.pushEventHandler(this.handleEvents, this);
	}

	ngOnDestroy(): void {
		this.auth.popEventHandler();
	}

	private handleEvents(event: MessageEvent<any>): void {
		let message = JSON.parse(event.data.toString()) as Message<unknown>;
		switch (message.event) {
			case EventType.CST_SONG_update:
				const data = extractMessageData<CstSongResUpdate>(message);
				this.songUpdate(data);
				break;
		}
	}

	private songUpdate(response: CstSongResUpdate) {
		const songInfo = response.songInfo;
		switch (response.status) {
			case "added":
			case "modified":
				this.songs.set(songInfo.id, songInfo);
				break;
			case "removed":
				this.songs.delete(songInfo.id);
				break;
		}
	}

	public checkFormValidity(): string[] {
		const keysForm = Object.keys(this.newSongForm.controls);
		const invalidKeys = [];

		for (const key of keysForm) {
			if (!this.newSongForm.controls[key].valid) {
				invalidKeys.push(key);
			};
		}

		return invalidKeys;
	}

	getUserSongs(): Song[] {
		const songValues = Array.from(this.songs.values());
		return songValues.filter((song) => song.user === this.auth.uid);
	}

	getSearchHelpers(): SearchHelper[] {
		return SEARCH_HELPERS;
	}

	onNavigate(formatter: SearchQuery): void {
		window.open(formatter(this.newSongForm.value['title'], this.newSongForm.value['author']), "_blank");
	}

	removeSong(id: number): void {
		const removeSongMessage = createMessage<CstSongReqRemove>(EventType.CST_SONG_remove, { cstId: this.cstID, songId: id });
		this.auth.ws.send(removeSongMessage);
	}

	getLanguages(): string[] | undefined {
		if (this.isInstrumental()) return [INSTRUMENTAL_CODE];
		return isEmpty(this.languages) ? undefined : keepUniqueValues(this.languages.map(langage => LANGUAGES_FR_TO_CODE.get(langage) || ""));
	}

	isInstrumental(): boolean {
		return this.newSongForm.value["isInstrumental"] === true;
	}

	addSong(): void {
		const invalidValues = this.checkFormValidity();
		if (!isEmpty(invalidValues)) {
			const text = `Certains champs sont invalides : ${invalidValues.join(', ')}`;
			this.errorStatus.notify(text, true);
		} else {
			const song: Song = {
				id: -1,
				user: '',
				platform: URLToSongPlatform(this.newSongForm.value['url']),
				title: this.newSongForm.value['title'],
				author: this.newSongForm.value['author'],
				url: this.newSongForm.value['url'],

				// optionnal fields
				addedDate: new Date().toISOString(),
				altTitles: isEmpty(this.altTitles) ? undefined : this.altTitles,
				album: isNull(this.newSongForm.value['album']) ? undefined : this.newSongForm.value['album'],
				releaseYear: isNull(this.newSongForm.value['releaseYear']) ? undefined : this.newSongForm.value['releaseYear'],
				genres: isEmpty(this.genres) ? undefined : keepUniqueValues(this.genres),
				languages: this.getLanguages(),
			};

			const newSongMessage = createMessage<CstSongReqAdd>(EventType.CST_SONG_add, { cstId: this.cstID, songData: song });
			this.auth.ws.send(newSongMessage);
		}

		this.newSongForm.reset();
		this.altTitles = [];
		this.genres = [];
		this.genresForm.setValue(null);
		this.languages = [];
		this.languagesForm.setValue(null);
	}

	closeWindow(): void {
		this.dialogRef.close();
	}

	// VERIFY DATA

	isNil(key: string): boolean {
		return isNil(this.newSongForm.value[key]) || this.newSongForm.value[key] === '';
	}

	respectLengthLimit(key: string): boolean {
		if (isNil(this.newSongForm.value[key])) return false;

		switch (key) {
			case 'title':
				return this.newSongForm.value[key].length > SONG_NAME_LENGTH;
			case 'author':
				return this.newSongForm.value[key].length > SONG_AUTHOR_LENGTH;
		}
		return false;
	}

	showKalimbaValue(key: string): string {
		switch (key) {
			case 'title':
				return this.newSongForm.value[key].substring(0, SONG_NAME_LENGTH);
			case 'author':
				return this.newSongForm.value[key].substring(0, SONG_AUTHOR_LENGTH);
		}
		return '';
	}

	isValidURL(): boolean {
		const url = this.newSongForm.value['url'];
		if (isNil(url)) return false;
		return URLToSongPlatform(url) !== SongPlatform.INVALID_PLATFORM;
	}

	songPlatformFromIcon(): string {
		const url = this.newSongForm.value['url'];
		switch (URLToSongPlatform(url)) {
			case SongPlatform.SOUNDCLOUD: return `${ICONS_PATH}/soundcloud.png`;
			case SongPlatform.YOUTUBE: return `${ICONS_PATH}/youtube.png`;
			case SongPlatform.PEERTUBE: return `${ICONS_PATH}/peertube.png`;
		}
		return `${ICONS_PATH}/invalid.png`;
	}

	getCurrentYear(): number {
		return new Date().getFullYear();
	}

	add(event: MatChipInputEvent, source?: "altTitles" | "genres"): void {
		const value = (event.value || '').trim();
		if (value) {
			switch (source) {
				case "altTitles":
					this.altTitles.push(value);
					break;
				case "genres":
					this.genres.push(value);
					this.genresForm.setValue(null);
					break;
			}
		}
		event.chipInput!.clear();
	}

  remove(value: string, source?: "altTitles" | "genres" | "languages"): void {
		switch (source) {
			case "altTitles":
				this.altTitles = removeElementFromArray(value, this.altTitles);
				break;
			case "genres":
				this.genres = removeElementFromArray(value, this.genres);
				break;
			case "languages":
				this.languages = removeElementFromArray(value, this.languages);
				break;
		}
	}

  selected(event: MatAutocompleteSelectedEvent, source: "genres" | "languages"): void {
		switch (source) {
			case "genres":
				this.genres.push(event.option.viewValue);
				this.genreInput.nativeElement.value = '';
				this.genresForm.setValue(null);
				break;
			case "languages":
				this.languages.push(event.option.viewValue);
				this.languageInput.nativeElement.value = '';
				this.languagesForm.setValue(null);
		}
  }

	private _filter(value: string, source: "genres" | "languages"): string[] {
    const filterValue = value.toLowerCase();
		if (source === "genres") return this.allGenres.filter(genre => genre.toLowerCase().includes(filterValue));
		if (source === "languages") return this.allLanguages.filter(langage => langage.toLowerCase().includes(filterValue));
		return [];
  }
}
