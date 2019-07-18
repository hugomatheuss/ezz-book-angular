import { Injectable } from '@angular/core';
import { Author } from './author';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  readonly url = 'http://localhost:3000/authors';

  private authorsSubject$: BehaviorSubject<Author[]> = new BehaviorSubject<Author[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Author[]> {
    if (!this.loaded) {
      this.http.get<Author[]>(this.url)
          .subscribe(this.authorsSubject$);
      this.loaded = true;
    }
    return this.authorsSubject$.asObservable();
  }

  add(author: Author): Observable<Author> {    
    return this.http.post<Author>(this.url, author)
      .pipe(
        tap((a: Author) => {
          this.authorsSubject$.getValue()
            .push(a);
        })
      );
  }

  del(author: Author): Observable<any> {
    return this.http.delete(`${this.url}/${author._id}`)
      .pipe(
        tap(() => {
          let authors = this.authorsSubject$.getValue();
          let i = authors.findIndex(a => a._id === author._id);
          if (i >= 0)
            authors.splice(i, 1);
        })
      )
  }

  update(author: Author): Observable<Author> {    
    return this.http.patch<Author>(`${this.url}/${author._id}`, author)
      .pipe(
        tap((author) => {
          let authors = this.authorsSubject$.getValue();
          let i = authors.findIndex(aut => aut._id === author._id);
          if (i >= 0) {
            authors[i] = author;
          }            
        })
      )
  }
}
