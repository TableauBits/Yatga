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
	CLIENT_authenticate = "CLIENT-authenticate",
	USER_get_one = "USER-get-one",
	USER_get_many = "USER-get-many",
	USER_get_all = "USER-get-all",
	USER_edit = "USER-edit",
}