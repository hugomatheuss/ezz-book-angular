import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Author } from '../author';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books: Book[] = [];
  authors: Author[] = [];
  private unsubscribe: Subject<any> = new Subject();

  bookForm: FormGroup = this.fb.group({
    _id: [null],
    title: ['', Validators.required],
    author: ['']    
  })

  constructor(private bookService: BookService, 
    private authorService: AuthorService, 
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.bookService.get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((myBooks) => this.books = myBooks);
    this.authorService.get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((myAuthors) => this.authors = myAuthors);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
  }

  notify(msg: string) {
    this.snackBar.open(msg, "OK", { duration: 3000 });
  }

  save() {
    let data = this.bookForm.value;
    if (data._id != null) {
      this.bookService.update(data)
        .subscribe(
          (book) => {
            this.notify('Updated');
            console.log(book);
          },
          (err) => {
            this.notify('Error');
            console.error(err);
          }
        )
    }
    else {
      this.bookService.add(data)
        .subscribe();
    }
  }

  delete(book: Book) {
    this.bookService.del(book)
      .subscribe(
        () => this.notify('Removed'),
        (err) => console.log(err)
      )
  }

}
