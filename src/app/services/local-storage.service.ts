import { Injectable } from '@angular/core';
import { INITIAL_LOCAL_STORAGE, LOCAL_STORAGE_VERSION, LocalStorageKey } from '../types/local-storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { this.init(); }

  private init() {
    const needReset = this.get(LocalStorageKey.VERSION) !== LOCAL_STORAGE_VERSION;

    if (needReset) this.reset();
    else {
      INITIAL_LOCAL_STORAGE.forEach((item) => {
        if (localStorage.getItem(item.key) === null) {
          localStorage.setItem(item.key, item.value);
        }
      });
    }
  }

  get(key: LocalStorageKey): string {
    const value = localStorage.getItem(key);
    return value ? value : "";
  }

  set(key: LocalStorageKey, value: string): void {
    localStorage.setItem(key, value);
  }

  reset(): void {
    INITIAL_LOCAL_STORAGE.forEach((item) => {
      localStorage.setItem(item.key, item.value);
    });
  }
}
