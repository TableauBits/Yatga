import { Injectable } from '@angular/core';
import { COUNTRY_CODES_TO_NAME } from '../types/country';

@Injectable({
  providedIn: 'root'
})
export class CountryManagerService {

  constructor() {
  }

  getCountryName(countries: string[]): string {
    if (countries.length === 0) return '';
    return COUNTRY_CODES_TO_NAME.get(countries[0]) || countries[0];
  }

  getCountryFlagSVG(countries: string[]): string {
		if (countries.length === 0) return '';
  	return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${countries[0]}.svg`;
	}
}
