export interface RoleData {
	name: string;
	icon: string;
}

export function returnUserRoles(roles: string[]): RoleData[] | undefined {
	if (roles === undefined) return undefined;
	return roles.map(role => USER_ROLES[role]);
}

const USER_ROLES: Record<string, RoleData> = {
	admin: { name: 'Admin', icon: 'verified_user' },
	dev: { name: 'Dev', icon: 'build' },
	member: { name: 'Membre', icon: 'headset' },
	test: { name: 'Cobaye', icon: 'adb' }
}
