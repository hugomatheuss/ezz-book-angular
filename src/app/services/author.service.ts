import { Injectable } from '@angular/core';
import { Author } from '../models/author';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private authorsCollection: AngularFirestoreCollection<Author> = this.afs.collection('authors');

  constructor(private afs: AngularFirestore) { }

  getAuthors(): Observable<Author[]> {
    return this.authorsCollection.valueChanges();
  }

  addAuthor(a: Author) {
    a.id = this.afs.createId();
    console.log(a.id);
    return this.authorsCollection.doc(a.id).set(a);
  } 

  updateAuthor(a: Author) {
    console.log(a.id);
    return this.authorsCollection.doc(a.id).set(a);
  }

  deleteAuthor(a: Author) {
    console.log(a.id);
    return this.authorsCollection.doc(a.id).delete();
  }

  searchByName(name: string): Observable<Author[]> {
    return this.afs.collection<Author>('authors',
      ref => ref.orderBy('name').startAt(name).endAt(name+"\uf8ff"))
      .valueChanges();
  }
    
}
