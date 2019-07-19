import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {Post} from './post.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  url = 'https://angular-course-project-78270.firebaseio.com';

  constructor(private http: HttpClient) { }

  public add(post: Post): Observable<{ name: string }> {
    return this.http
      .post<{ name: string }>(
        this.url + '/posts.json',
        post)
        .pipe(
          catchError(this.handleError)
        );
  }

  public update(id: string, post: Post): Observable<{ name: string }> {
    const url = `${this.url}/posts/${id}.json`;
    return this.http.put<{ name: string }>(
      url,
      post)
      .pipe(
      catchError(this.handleError)
    );
  }

  public get(id: string): Observable<Post> {
    const url = `${this.url}/posts/${id}.json`;
    return this.http.get<Post>(
      url
    ).pipe(
      catchError(this.handleError)
    );
  }

  public getAll(query?: string): Observable<Post[]> {
    console.log(query);
    const url = `${this.url}/posts.json`;
    let options = {};
    if (query) {
      options = {
        params: new HttpParams()
          .append('orderBy', `"title"`)
          .append('startAt', `"${query.toUpperCase()}"`)
          .append('endAt', `"${query.toLowerCase()}\\uf8ff"`)
      };
    }
    return this.http
      .get<{ [key: string]: Post }>(
        url,
        options
      )
      .pipe(
        map(response => {
          const posts: Post[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              posts.push({ ...response[key], id: key });
            }
          }
          return posts;
        }),
        catchError(this.handleError)
      );
  }

  public delete(id: string): Observable<any> {
    const url = `${this.url}/posts/${id}.json`;
    return this.http.delete(
      url
    ).pipe(
      catchError(this.handleError)
    );
  }

  public deleteAll(): Observable<any> {
    return this.http.delete(
      this.url + '/posts.json', {
        observe: 'events'
      }
    ).pipe(
      tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Sent) {
          console.log('Request was sent');
        }
        if (event.type === HttpEventType.Response) {
          console.log('Response: ', event);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent || error.error instanceof ProgressEvent) {
      return throwError({
        title: 'Disabled internet connection',
        message: error.message,
        code: '404'
      });
    } else {
      return throwError({
        title: error.error.error,
        message: error.message,
        code: error.status
      });
    }
  }
}
