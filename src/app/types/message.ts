export interface Message<T> {
	event: string
	data: T
}

export interface ResponseStatus {
	success: boolean;
	status: string;
}

export function createMessage<T>(event: string, data: T): string {
	return JSON.stringify({ event: event, data: data });
}

export enum EventTypes {
	// From client
	CLIENT_authenticate = "CLIENT-authenticate",
	CLIENT_ping = "CLIENT-ping",

	USER_get = "USER-get",
	USER_get_all = "USER-get-all",
	USER_edit = "USER-edit",
	USER_create = "USER-create",
	USER_unsubscribe = "USER-unsubscribe",

	CST_get = "CST-get",
	CST_get_from_user = "CST-get-from-user",
	CST_create = "CST-create",
	CST_join = "CST-join",
	CST_unsubscribe = "CST-unsubscribe",

	// From server
	USER_update = "USER-update",
	CST_update = "CST-update",
}

