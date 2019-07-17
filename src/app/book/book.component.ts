import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  bookTitle: string = '';
  books: Book[] = [];
  bookEdit = null;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private bookService: BookService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.bookService.get()
      .subscribe((books) => this.books = books);
  }

}
