export enum ConstitutionType  {
  GRADE,
}

// TODO : Better names ?
export enum AnonymousLevel {
  PUBLIC,
  NO_USERNAME,
  SOUND_ONLY
}

export interface Constitution {
  id: string;
  season: number;
  part: number;
  name: string;
  isPublic: boolean;
  anonymousLevel: AnonymousLevel;
  type: ConstitutionType;
  state: number;

  users: string[];                // user[0] as owner
  numberOfSongsPerUser: number;
}