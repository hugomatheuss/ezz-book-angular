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
}
