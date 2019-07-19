import { Injectable } from '@angular/core';
import { Book } from './book';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  readonly url = 'http://localhost:3000/books';

  private booksSubject$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Book[]> {
    if (!this.loaded) {
      this.http.get<Book[]>(this.url)
        .subscribe(this.booksSubject$);
      this.loaded = true;
    }
    return this.booksSubject$.asObservable();
  }

  add(book: Book): Observable<Book> {    
    return this.http.post<Book>(this.url, book)
      .pipe(
        tap((b: Book) => {
          this.booksSubject$.getValue()
            .push(b);
        })
      );
  }

  update(book: Book): Observable<Book> {    
    return this.http.patch<Book>(`${this.url}/${book._id}`, book)
      .pipe(
        tap((book) => {
          let books = this.booksSubject$.getValue();
          let i = books.findIndex(b => b._id === book._id);
          if (i >= 0) {
            books[i] = book;
          }            
        })
      )
  }

  del(book: Book): Observable<any> {
    return this.http.delete(`${this.url}/${book._id}`)
      .pipe(
        tap(() => {
          let books = this.booksSubject$.getValue();
          let i = books.findIndex(b => b._id === book._id);
          if (i >= 0)
            books.splice(i, 1);
        })
      )
  }
}
