import { Constitution } from "@tableaubits/hang";

export const OWNER_INDEX = 0;

export const EMPTY_CONSTITUTION: Constitution =  {
  id : '',
  name: '',
  season: -1,
  part: -1,
  isPublic: false,
  anonymousLevel: -1,
  maxUserCount: -1,
  type: -1,
  state: -1,
  numberOfSongsPerUser: -1,
  playlistLink: '',
  users: []
}