import { ICONS_PATH } from "./icon";

type SearchQuery = (title: string, author: string) => string;

type SearchHelper = {
	name: string;
	iconPath: string;
	formatter: SearchQuery;
}

const SEARCH_HELPERS: SearchHelper[] = [
	{
		name: "Apple Music",
		iconPath: ICONS_PATH + "/apple_music.png",
		formatter: (title, author) => {
			return `https://music.apple.com/us/search?term=${author} ${title}`;
		}
	},
	{
		name: "Discogs",
		iconPath: ICONS_PATH + "/discogs.png",
		formatter: (title, author) => {
			return `https://www.discogs.com/search/?q=${author.split(" ").join("+")}+${title.split(" ").join("+")}&type=all&type=all`;
		}
	},
	{
		name: "Genius",
		iconPath: ICONS_PATH + "/genius.png",
		formatter: (title, author) => {
			return `https://genius.com/search?q=${author} ${title}`;
		},
	},
	{
		name: "LastFM",
		iconPath: ICONS_PATH + "/lastfm.png",
		formatter: (title, author) => {
			return `https://www.last.fm/search?q=${author.split(" ").join("+")}+${title.split(" ").join("+")}`;
		},
	},
  {
    name: "Soundcloud",
    iconPath: ICONS_PATH + "/soundcloud.png",
    formatter: (title, author) => {
      return `https://soundcloud.com/search?q=${author} ${title}`;
    }
  },
	{
		name: "Spotify",
		iconPath: ICONS_PATH + "/spotify.png",
		formatter: (title, author) => {
			return `https://open.spotify.com/search/${author} ${title}`;
		}
	},
];

export {
  SearchHelper,
  SEARCH_HELPERS,
  SearchQuery
};