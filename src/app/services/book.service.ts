import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksCollection: AngularFirestoreCollection<Book> = this.afs.collection('books');

  constructor(private afs: AngularFirestore) { }

  getBooks(): Observable<Book[]>{    
    return this.booksCollection.valueChanges();
  }

  addBook(b: Book) {
    b.id = this.afs.createId();
    console.log(b);
    return this.booksCollection.doc(b.id).set(b);
  }

  updateBook(b: Book) {
    return this.booksCollection.doc(b.id).set(b);
  }

  deleteBook(b: Book) {
    return this.booksCollection.doc(b.id).delete();
  }

  searchByTitle(title: string): Observable<Book[]> {
    return this.afs.collection<Book>('books',
      ref => ref.orderBy('title').startAt(title).endAt(title+"\uf8ff"))
      .valueChanges();
  }
}
