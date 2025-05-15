import { countries } from 'countries-list';

export const COUNTRY_NAMES_TO_CODE: Map<string, string> = new Map<string, string>();
export const COUNTRY_CODES_TO_NAME: Map<string, string> = new Map<string, string>();

for (const [key, value] of Object.entries(countries)) {
  COUNTRY_CODES_TO_NAME.set(key, value.name);
  COUNTRY_NAMES_TO_CODE.set(value.name, key);
}

