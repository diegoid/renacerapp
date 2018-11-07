import {Serializable} from "./serializalble.interface";

export class ContactRequest {
	name: string;
	email: string;
	message: string;
	subject: string;
	
	constructor(name: string, email: string, message: string) {
        this.name = name;
		this.email = email;
		this.message = message;
		this.subject = 'Contact';
    }
}