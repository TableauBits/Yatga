import { Component, Input } from '@angular/core';
import { GuessUserData, Song, User } from 'chelys';

interface ConfusionMatrixRow {
  actualUser: User,
  counts: Map<string, number>,
  total: number
}

interface GuessAccuracyRow {
  user: User,
  total: number,
  correct: number,
  precision: number
}

interface SongRecognitionRow {
  song: Song,
  total: number,
  correct: number,
  precision: number
}

@Component({
  selector: 'app-grade-guess',
  templateUrl: './grade-guess.component.html',
  styleUrls: ['./grade-guess.component.scss']
})
export class GradeGuessComponent {
  @Input() users: Map<string, User> = new Map();
  @Input() songs: Map<number, Song> = new Map();
  @Input() userGuesses: Map<string, GuessUserData> = new Map();

  selectedUser: string = '';

  hasAnyGuesses(): boolean {
    return Array.from(this.userGuesses.values()).some((userData) => userData.guesses.size > 0);
  }

  getConfusionMatrixUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserList(): User[] {
    return Array.from(this.users.values());
  }

  getUser(uid: string): User {
    return this.users.get(uid) || { uid: '', displayName: '', photoURL: '', description: '' } as User;
  }

  getSelectedUser(): User {
    return this.users.get(this.selectedUser) || this.getUserList()[0] || { uid: '', displayName: '', photoURL: '', description: '' } as User;
  }

  getConfusionMatrixRows(): ConfusionMatrixRow[] {
    const matrixUsers = this.getConfusionMatrixUsers();
    const rows = matrixUsers.map((actualUser) => ({
      actualUser,
      counts: new Map(matrixUsers.map((guessedUser) => [guessedUser.uid, 0] as [string, number])),
      total: 0
    }));
    const rowsByUser = new Map(rows.map((row) => [row.actualUser.uid, row]));

    const guessEntries = this.selectedUser
      ? [this.userGuesses.get(this.selectedUser)].filter((value): value is GuessUserData => !!value)
      : Array.from(this.userGuesses.values());

    for (const song of this.songs.values()) {
      const row = rowsByUser.get(song.user);
      if (!row) continue;

      for (const userData of guessEntries) {
        const guessedUserId = userData.guesses.get(song.id);
        if (!guessedUserId || !row.counts.has(guessedUserId)) continue;

        row.counts.set(guessedUserId, (row.counts.get(guessedUserId) || 0) + 1);
        row.total++;
      }
    }

    return rows;
  }

  getConfusionMatrixValue(row: ConfusionMatrixRow, guessedUser: User): number {
    return row.counts.get(guessedUser.uid) || 0;
  }

  isCorrectMatrixCell(row: ConfusionMatrixRow, guessedUser: User): boolean {
    return row.actualUser.uid === guessedUser.uid;
  }

  getGuessAccuracyRows(): GuessAccuracyRow[] {
    return Array.from(this.users.values()).map((user) => {
      const userGuesses = this.userGuesses.get(user.uid)?.guesses || new Map<number, string>();
      let correct = 0;

      for (const [songId, guessedUserId] of userGuesses.entries()) {
        const song = this.songs.get(songId);
        if (!song) continue;

        if (song.user === guessedUserId) {
          correct++;
        }
      }

      const total = userGuesses.size;
      return {
        user,
        total,
        correct,
        precision: total === 0 ? 0 : (correct / total) * 100,
      };
    }).sort((a, b) => b.precision - a.precision || b.correct - a.correct);
  }

  getSongRecognitionRows(): SongRecognitionRow[] {
    return Array.from(this.songs.values()).map((song) => {
      let total = 0;
      let correct = 0;

      for (const userData of this.userGuesses.values()) {
        const guessedUserId = userData.guesses.get(song.id);
        if (!guessedUserId) continue;

        total++;
        if (song.user === guessedUserId) {
          correct++;
        }
      }

      return {
        song,
        total,
        correct,
        precision: total === 0 ? 0 : (correct / total) * 100,
      };
    }).sort((a, b) => b.precision - a.precision || b.correct - a.correct);
  }

  getMostRecognizedSong(): SongRecognitionRow | null {
    const rows = this.getSongRecognitionRows();
    return rows.filter((row) => row.total > 0).sort((a, b) => b.precision - a.precision)[0] || null;
  }

  getLeastRecognizedSong(): SongRecognitionRow | null {
    const rows = this.getSongRecognitionRows();
    return rows.filter((row) => row.total > 0).sort((a, b) => a.precision - b.precision)[0] || null;
  }
}

