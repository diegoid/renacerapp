import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";

import { APP_CONFIG, AppConfig } from "../app/app.config";
import { NetworkError } from "../models/network-error.model";
import { Post } from "../models/post.models";
import { Comment } from "../models/comment.models";
import { Category } from "../models/category.models";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { RegisterRequest } from "../models/register-request.models";
import { RegisterResponse } from "../models/register-response.models";
import { UserResponse } from "../models/user-response.models";
import { ReactionResponse } from "../models/reaction-response.models";
import { CommentRequest } from "../models/comment-request.models";
import { ContactResponse } from "../models/contact-response.models";
import { ContactRequest } from "../models/contact-request.models";


@Injectable()
export class WordpressClient {
  private searchHistory: Array<string>;
  
	private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) {

	}

	public contactUs(contactRequest: ContactRequest): Observable<ContactResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
		return this.http
			.post<ContactResponse>(this.config.apiBase + 'contact-form-7/v1/contact-forms/3751/feedback', contactRequest, { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public postReaction(postId: string, reaction: string, userId: string): Observable<ReactionResponse> {
		return this.http
			.get<ReactionResponse>(this.config.apiBase + 'reaction/v1/react/' + postId + '?type=' + reaction + '&user_id=' + userId)
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public getUser(adminToken: string, userId: string): Observable<UserResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken });
		return this.http
			.get<UserResponse>(this.config.apiBase + 'wp/v2/users/' + userId, { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public createUser(adminToken: string, credentials: RegisterRequest): Observable<RegisterResponse> {
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken });
		return this.http
			.post<RegisterResponse>(this.config.apiBase + 'wp/v2/users', JSON.stringify(credentials), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public postComment(postId: string, commentRequest: CommentRequest, userToken: string): Observable<Comment> {
		//opuslabs.in/wp-json/wp/v2/comments?post=276
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken });
		return this.http
			.post<Comment>(this.config.apiBase + 'wp/v2/comments/' + '?post=' + postId, JSON.stringify(commentRequest), { headers: myHeaders })
			.concatMap(data => {
				data.date = this.formatDate(new Date(data.date));
				return Observable.of(data);
			});
	}

	public getAuthToken(credentials: AuthCredential): Observable<AuthResponse> {
		console.log('token request for: ' + JSON.stringify(credentials));
		const myHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http
			.post<AuthResponse>(this.config.apiBase + 'jwt-auth/v1/token', JSON.stringify(credentials), { headers: myHeaders })
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public categories(pageNo: string): Observable<Array<Category>> {
		return this.http
			.get<Array<Category>>(this.config.apiBase + 'wp/v2/categories/' + '?per_page=20&page=' + pageNo)
			.concatMap(data => {
				return Observable.of(data);
			});
	}

	public postBlogs(pageNo: string): Observable<Array<Post>> {
		return this.http
			.get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?categories=623&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

	public postById(id: string): Observable<Post> {
		return this.http
			.get<Post>(this.config.apiBase + 'wp/v2/posts/' + id + '?_embed')
			.concatMap(data => {
				data.date = this.formatDate(new Date(data.date));
				return Observable.of(data);
			});
	}

	public postByTag(tag: string, pageNo: string): Observable<Array<Post>> {
		return this.http
			.get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?tags=' + tag + '&page=' + pageNo + '&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

	public postAll(pageNo: string): Observable<Array<Post>> {
		//console.log('url: ' + this.config.apiBase+'wp/v2/posts/' + '?categories='+category+'&page='+pageNo+'&_embed');
		return this.http
			.get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?page=' + pageNo + '&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

	public postByCategory(category: string, pageNo: string): Observable<Array<Post>> {
		//console.log('url: ' + this.config.apiBase+'wp/v2/posts/' + '?categories='+category+'&page='+pageNo+'&_embed');
		return this.http
			.get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?categories=' + category + '&page=' + pageNo + '&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

	public getComments(postId: string, pageNo: string): Observable<Array<Comment>> {
		//opuslabs.in/wp-json/wp/v2/comments?post=276
		return this.http
			.get<Array<Comment>>(this.config.apiBase + 'wp/v2/comments/' + '?post=' + postId + '&page=' + pageNo)
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let comment = data[i];
					comment.date = this.formatDate(new Date(comment.date));
				}
				return Observable.of(data);
			});
	}

  public postsByQuery(query: string, pageNo: string): Observable<Array<Post>> {
    return this.http
    .get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?search=' + query + '&page=' + pageNo + '&_embed')
    .concatMap(data => {
      return Observable.of(data);
    });
  }

	public postByCategories(categories: Array<string>, pageNo: string): Observable<Array<Post>> {
		let url: string = this.config.apiBase + 'wp/v2/posts/' + '?categories=';
		for (let catId of categories) {
			url += catId + ',';
		}
		console.log(url);
		if (url.charAt(url.length - 1) == ',') {
			url = url.substring(0, url.length - 1);
		}
		console.log(url);
		return this.http
			.get<Array<Post>>(url + '&page=' + pageNo + '&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

	public postByCategoryAndTag(category: string, tag: string, pageNo: string): Observable<Array<Post>> {
		return this.http
			.get<Array<Post>>(this.config.apiBase + 'wp/v2/posts/' + '?categories=' + category + '&tags=' + tag + '&page=' + pageNo + '&_embed')
			.concatMap(data => {
				for (let i = 0; i < data.length; i++) {
					let post = data[i];
					post.date = this.formatDate(new Date(post.date));
				}
				return Observable.of(data);
			});
	}

  addInSearchHistory(query: string) {
    this.checkSearchHistory();
    let index: number = this.searchHistory.indexOf(query);
    if (index == -1) {
      if (this.searchHistory.length == 5) {
        this.searchHistory.splice(0, 1);
      }
      this.searchHistory.push(query);
      window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
  }

  checkSearchHistory() {
    if (this.searchHistory == null) {
      let history: Array<string> = JSON.parse(window.localStorage.getItem('searchHistory'));
      if (history != null) {
        this.searchHistory = history;
      } else {
        this.searchHistory = new Array<string>();
      }
    }
  }

  getSearchHistory() {
    this.checkSearchHistory();
    return this.searchHistory;
  }

  clearSearchHistory() {
    this.searchHistory = new Array<string>();
    window.localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

	private formatDate(date: Date): string {
		return this.months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	}
}