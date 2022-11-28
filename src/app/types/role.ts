export interface RoleData {
	name: string;
	importance: number;
	icon: string;
}

export function returnUserRoles(roles: string[]): RoleData[] | undefined {
	if (roles === undefined) return undefined;
	return roles.map(role => USER_ROLES[role]).sort((r1, r2) => {
		return r1.importance - r2.importance;
	});
}

export const USER_ROLES: Record<string, RoleData> = {
	dev: { name: 'Dev',  importance: 0, icon: 'build' },
	admin: { name: 'Admin', importance: 1, icon: 'verified_user' },
	member: { name: 'Membre', importance: 2, icon: 'headset' },
	test: { name: 'Cobaye', importance: 3, icon: 'adb' }
};
