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

export interface Role {
  name: string;
  icon: string;
}

export function returnUserRoles(roles: string[]): Role[] | undefined {
  if (roles === undefined) return undefined;
  return roles.map(role => USER_ROLES[role]);
}

const USER_ROLES: Record<string, Role> = {
  admin: {name: 'Admin', icon: 'verified_user'},
  dev: {name: 'Dev', icon: 'build'},
  member: {name: 'Membre', icon: 'headset'},
  test: {name: 'Cobaye', icon: 'adb'}
}
