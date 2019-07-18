import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {Post} from './post.model';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  url = 'https://angular-course-project-78270.firebaseio.com/';

  constructor(private http: HttpClient) { }

  public add(post: Post): Observable<{ name: string }> {
    return this.http
      .post<{ name: string }>(
        this.url + 'posts.json',
        post)
        .pipe(
          catchError(error => {
            return throwError(this.getError(error));
          })
        );
  }

  public getAll(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>(
        this.url + 'posts.json',
        {
          headers: new HttpHeaders({'x-app-id': '1324'}),
          params: new HttpParams()
            .append('s', 'something')
            .append('page', '1')
        })
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
        catchError(error => {
          return throwError(this.getError(error));
        })
      );
  }

  public deleteAll(): Observable<any> {
    return this.http.delete(
      this.url + 'posts.json', {
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
      catchError(error => {
        return throwError(this.getError(error));
      })
    );
  }

  private getError(error) {
    return { title: error.error.error, message: error.message };
  }
}
