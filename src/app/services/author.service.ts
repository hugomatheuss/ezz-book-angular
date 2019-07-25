import { Injectable } from '@angular/core';
import { Author } from '../models/author';
//import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
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

     
    
}
