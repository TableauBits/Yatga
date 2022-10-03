import { canModifyVotes, Constitution, EMPTY_CONSTITUTION, EMPTY_SONG, FAVORITES_MAX_LENGTH, Song, UserFavorites } from "chelys";
import { isNil } from "lodash";

export class YatgaUserFavorites {
  public constitution: Constitution = EMPTY_CONSTITUTION;
  public currentSong: Song = EMPTY_SONG;
  public favorites: UserFavorites = { uid: "", favs: [] };

  canModifyFavorite(): boolean {
		return canModifyVotes(this.constitution);
	}

  isAFavorite(): boolean {
		if (isNil(this.favorites)) return false;
		return this.favorites.favs.includes(this.currentSong.id);
	}

  noMoreFavorites(): boolean {
		if (isNil(this.favorites)) return false;
		return FAVORITES_MAX_LENGTH === this.favorites.favs.length && !this.favorites.favs.includes(this.currentSong.id);
	}
}