import { Injectable } from '@angular/core';
import { countries } from 'countries-list';

@Injectable({
  providedIn: 'root'
})
export class CountryManagerService {

  COUNTRY_NAMES_TO_CODE: Map<string, string> = new Map<string, string>();
  COUNTRY_CODES_TO_NAME: Map<string, string> = new Map<string, string>();

  constructor() {
    for (const [key, value] of Object.entries(countries)) {
      this.COUNTRY_CODES_TO_NAME.set(key, value.name);
      this.COUNTRY_NAMES_TO_CODE.set(value.name, key);
    }
  }

  getCountryName(countries: string[]): string {
    if (countries.length === 0) return '';
    return this.COUNTRY_CODES_TO_NAME.get(countries[0]) || countries[0];
  }

  getCountryFlagSVG(countries: string[]): string {
		if (countries.length === 0) return '';
  	return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countries[0]}.svg`;
	}
}
