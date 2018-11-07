import {Serializable} from "./serializalble.interface";

export class Category {
	id: string;
	parent: string;
	name: string;
	description: string;
	count: string;
	slug: string;
	link: string;
	selected: boolean;
}