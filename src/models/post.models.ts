import {Serializable} from "./serializalble.interface";

export class Post {
	id: string;
	date: string;
	title: string;
	content: string;
	excerpt: string;
	link: string;
	meta: Reaction;
	reactionImage: string;
	viewReactionOptions:Boolean;
}

export class Reaction {
	love: number;
	lol: number;
	wow: number;
	sad: number;
	angry: number;
}