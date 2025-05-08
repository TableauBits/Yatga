import { Component } from '@angular/core';
import { ConstitutionMetadata, createMessage, EMPTY_REWIND, EMPTY_SONG, EMPTY_USER, EventType, extractMessageData, Message, RewindPerYear, RwdReqGet, RwdResUpdate, Song, User, UsrResUpdate } from 'chelys';
import { isNil } from 'lodash';
import { AuthService } from 'src/app/services/auth.service';
import { RingGaugeData } from 'src/app/types/charts';
import { deepRecordConvert } from 'src/app/types/utils';

@Component({
  selector: 'app-rewind-page',
  templateUrl: './rewind-page.component.html',
  styleUrls: ['./rewind-page.component.scss']
})
export class RewindPageComponent {
  public rewinds: Map<number, RewindPerYear> = new Map();

  public selectedYear?: number;
  public selectedRewind?: RewindPerYear;

  private users: Map<string, User> = new Map();

  public gaugeData: RingGaugeData[] = [];

  constructor(public auth: AuthService) {
    this.auth.pushAuthFunction(this.onConnect, this);
    this.auth.pushEventHandler(this.handleEvents, this);
  }

  private handleEvents(event: MessageEvent<any>): void {
    const message = JSON.parse(event.data.toString()) as Message<unknown>;

    switch (message.event) {
      case EventType.REWIND_update: {
        const data = extractMessageData<RwdResUpdate>(message);
        data.rewind = deepRecordConvert(data.rewind, EMPTY_REWIND);

        this.rewinds.set(data.year, data.rewind);
        if (this.selectedYear === undefined || this.selectedYear < data.year) {
          this.selectedYear = data.year;
          this.selectedRewind = data.rewind;
          this.generateGaugeData();

          this.selectedRewind.baseStats.bestSongs.songs
        }
      } break;

      case EventType.USER_update: {
        const data = extractMessageData<UsrResUpdate>(message).userInfo;
        this.users.set(data.uid, data);
      } break;
    }
  }

  private onConnect(): void {
    this.auth.ws.send(
      createMessage(EventType.USER_get_all, {})
    );

    this.auth.ws.send(
      createMessage<RwdReqGet>(EventType.REWIND_get, { uid: this.auth.uid }));
  }

  getUser(uid: string): User {
    const user = this.users.get(uid);
    if (isNil(user)) return EMPTY_USER;
    return user;
  }

  selectYear(): void {
    const year = this.selectedYear;
    if (isNil(year)) return;
    this.selectedRewind = this.rewinds.get(year);
    this.generateGaugeData();
  }

  generateGaugeData(): void {
    this.gaugeData = [];

    if (isNil(this.selectedRewind)) return;

    this.gaugeData.push({
      value: 100 - Number((this.selectedRewind.baseStats.missing.decades * 100 / this.selectedRewind.baseStats.nSongs).toFixed(2)),
      name: "Décennies",
      title: {
        offsetCenter: ['0%', '-30%'],
        color: '#F5F5F5',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '-20%']
      }
    });

    this.gaugeData.push({
      value: 100 - Number((this.selectedRewind.baseStats.missing.languages * 100 / this.selectedRewind.baseStats.nSongs).toFixed(2)),
      name: "Langues",
      title: {
        offsetCenter: ['0%', '0%'],
        color: '#F5F5F5',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '10%']
      }
    });

    this.gaugeData.push({
      value: 100 - Number((this.selectedRewind.baseStats.missing.genres * 100 / this.selectedRewind.baseStats.nSongs).toFixed(2)),
      name: "Genres",
      title: {
        offsetCenter: ['0%', '30%'],
        color: '#F5F5F5',
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '40%']
      }
    });
  }

  getSongInfo(id: string): Song {
    return this.selectedRewind?.metadata.songInfo.get(id) ?? EMPTY_SONG;
  }

  getCstData(globalID: string): ConstitutionMetadata {
    const cstID = globalID.split('.')[0];
    return this.selectedRewind?.metadata.cstInfo.get(cstID) ?? { name: "INVALID", nSongs: 0 };
  }
}
