import { Injectable } from '@angular/core';
import { Author } from './author';
import { Book } from './book';
import { BookService } from './book.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  readonly url = 'http://localhost:3000/authors';

  private authorsSubject$: BehaviorSubject<Author[]> = new BehaviorSubject<Author[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient,
    private bookService: BookService) { }

  get(): Observable<Author[]> {
    if (!this.loaded) {
      combineLatest(
        this.http.get<Author[]>(this.url),
        this.bookService.get())
        .pipe(
          tap(([authors, books]) => console.log(authors, books)),
          map(([authors, books]) => {
            for (let a of authors) {
              let ids = (a.books as string[]);
              a.books = ids.map((id) => books.find(book => book._id == id));
            }
            return authors;
          }),
          tap((authors) => console.log(authors))
        )
        .subscribe(this.authorsSubject$);

      this.loaded = true;
    }
    return this.authorsSubject$.asObservable();
  }

  add(author: Author): Observable<Author> {
    let books = (author.books as Book[]).map(book=>book._id)
    return this.http.post<Author>(this.url, {...author, books})
      .pipe(
        tap((a) => {
          this.authorsSubject$.getValue()
            .push({ ...author, _id: a._id })
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
    let books = (author.books as Book[]).map(book => book._id);
    return this.http.patch<Author>(`${this.url}/${author._id}`, { ...author, books })
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
