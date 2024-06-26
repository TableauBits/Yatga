import { getAll639_1, getName } from 'all-iso-language-codes';
import { capitalizeFirstLetter } from './utils';
import genres from "../../assets/genres.json";

export const ALL_LANGUAGES_FR = getAll639_1().map((code) => capitalizeFirstLetter(getName(code, "fr") as string));
export const LANGUAGES_FR_TO_CODE = new Map<string, string>();
export const LANGUAGES_CODE_TO_FR = new Map<string, string>();
export const INSTRUMENTAL_CODE = "ins";

// ISO 639_1
getAll639_1().forEach((code) => {
  LANGUAGES_FR_TO_CODE.set(capitalizeFirstLetter(getName(code, "fr") as string), code);
  LANGUAGES_CODE_TO_FR.set(code, capitalizeFirstLetter(getName(code, "fr") as string));
});

// Special case
/// Instrumental
LANGUAGES_CODE_TO_FR.set(INSTRUMENTAL_CODE, "Instrumental");

/// Autre
ALL_LANGUAGES_FR.push("Autre");
LANGUAGES_CODE_TO_FR.set("oth", "Autre");
LANGUAGES_FR_TO_CODE.set("Autre", "oth");

export const ALL_GENRES = genres.sort();