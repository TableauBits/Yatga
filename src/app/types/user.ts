export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  roles: string[];
}

export const EMPTY_USER: User = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  roles : []
}