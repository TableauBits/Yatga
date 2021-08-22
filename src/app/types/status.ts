export class Status {
  error: boolean;
	hidden: boolean;
	message: string;

  constructor() {
    this.error = false;
    this.hidden = true;
    this.message = "";
  }

  notify(message: string, isError: boolean) {
    this.message = message;
    this.error = isError;
    this.hidden = false;
  }

  clearStatus() {
    this.error = false;
    this.hidden = true;
    this.message = "";
  }
}