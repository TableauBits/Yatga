export const LOCAL_STORAGE_VERSION = "v1.0.0";

export type SongView = "card" | "list";
export type SongSort = "";

export enum LocalStorageKey {
  SONGS_VIEW_KEY = "yatga.settings.songsView",
  SONGS_SORT_KEY = "yatga.settings.songsSort",
  GRADE_ALREADY_VOTED_KEY = "yatga.settings.gradeShowAlreadyVoted",
  GRADE_SHOW_STATS_KEY = "yatga.settings.gradeShowStats",
  VERSION = "yatga.settings.version",
}

type LocalStorageItem = {
  key: LocalStorageKey
  value: SongView | string
}

export const INITIAL_LOCAL_STORAGE: LocalStorageItem[] = [
  {
    key: LocalStorageKey.SONGS_VIEW_KEY,
    value: "card"
  },
  {
    key: LocalStorageKey.SONGS_SORT_KEY,
    value: "true"
  },
  {
    key: LocalStorageKey.GRADE_ALREADY_VOTED_KEY,
    value: "true"
  },
  {
    key: LocalStorageKey.GRADE_SHOW_STATS_KEY,
    value: "false"
  },
  {
    key: LocalStorageKey.VERSION,
    value: LOCAL_STORAGE_VERSION
  }
];

// TODO 
// export const CARDS_VIEW_KEY = "setting.cardsView";
// export const CARDS_SORT_KEY = "setting.cardsSort";

// export const GRADE_ALREADY_VOTES_KEY = "setting.gradeShowAlreadyVode";
// export const GRADE_SHOW_STATS_KEY = "setting.gradeShowStats";
