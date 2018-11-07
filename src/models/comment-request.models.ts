import {Serializable} from "./serializalble.interface";

export class CommentRequest {
	content: string;
	
	constructor(comment: string) {
        this.content = comment;
    }
}