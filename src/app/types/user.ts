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
  // description: string;
  icon: string;
}

export function returnUserRoles(roles: string[]): Role[] | undefined {
  if (roles === undefined) return undefined;
  return roles.map(role => USER_ROLES[role]);
}

const USER_ROLES: Record<string, Role> = {
  dev: {name: 'Dev', icon: 'build'},
  admin: {name: 'Admin', icon: 'verified_user'},
  member: {name: 'Membre', icon: 'headset'},
  test: {name: 'Cobaye', icon: 'device_unknown'}
}