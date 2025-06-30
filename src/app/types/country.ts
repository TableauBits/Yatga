import * as COUNTRY_FR from '../../assets/countries.json';

export const COUNTRY_NAMES_TO_CODE: Map<string, string> = new Map<string, string>();
export const COUNTRY_CODES_TO_NAME: Map<string, string> = new Map<string, string>();

for (const [key, value] of Object.entries(COUNTRY_FR)) {
  COUNTRY_CODES_TO_NAME.set(key, value);
  COUNTRY_NAMES_TO_CODE.set(value, key);
}
