import { canModifyVotes, Constitution, EMPTY_CONSTITUTION, FAVORITES_MAX_LENGTH, Song, UserFavorites } from "chelys";

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
}