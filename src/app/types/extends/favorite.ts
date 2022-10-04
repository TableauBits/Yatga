import { canModifyVotes, Constitution, createMessage, EMPTY_CONSTITUTION, EventType, FAVORITES_MAX_LENGTH, FavReqAdd, FavReqRemove, Song, UserFavorites } from "chelys";
import { AuthService } from "src/app/services/auth.service";

export class YatgaUserFavorites {
  public constitution: Constitution = EMPTY_CONSTITUTION;
  public favorites: UserFavorites = { uid: "", favs: [] };

  canModifyFavorite(): boolean {
		return canModifyVotes(this.constitution);
	}

  isAFavorite(song: Song): boolean {
		return this.favorites.favs.includes(song.id);
	}

  noMoreFavorites(song: Song): boolean {
		return FAVORITES_MAX_LENGTH === this.favorites.favs.length && !this.favorites.favs.includes(song.id);
	}

	toggleFavorite(song: Song, auth: AuthService): void {
		let message: string;

		if (this.favorites.favs.includes(song.id)) {
			// remove the song from favorites
			message = createMessage<FavReqRemove>(EventType.CST_SONG_FAV_remove, { cstId: this.constitution.id, songId: song.id });
		} else {
			// add the song to the favorites
			message = createMessage<FavReqAdd>(EventType.CST_SONG_FAV_add, { cstId: this.constitution.id, songId: song.id });
		}

		auth.ws.send(message);
	}
}