import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { Validators, FormBuilder } from '@angular/forms';
import { BookService } from '../services/book.service';
import { MatSnackBar } from '@angular/material';
import { Author } from '../models/author';
import { AuthorService } from '../services/author.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books$: Observable<Book[]>;
  authors$: Observable<Author[]>;
  filterBooks$: Observable<Book[]>;
  displayedColumns = ['title', 'authorId', 'operations'];

  @ViewChild('title', {static: false}) bookTitle: ElementRef; 

  bookForm = this.fb.group({
    id: [undefined],
    title: ['', [Validators.required]],
    authorId: [''],
  })

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authors$ = this.authorService.getAuthors();
    this.books$ = this.bookService.getBooks();
  }

  onSubmit() {
    let b: Book = this.bookForm.value;
    if(!b.id) {
      console.log(b);
      this.addBook(b);
    }
    else {
      this.updateBook(b);
    }
  }

  addBook(b: Book) {
    this.bookService.addBook(b)
      .then(()=> {
        this.snackBar.open('Livro criado com sucesso', 'OK', {duration: 2000});
        this.bookForm.reset({title: '', id: undefined, authorId: ''});
        this.bookTitle.nativeElement.focus();
      })
      .catch(()=> {
        this.snackBar.open('Falha na criação do livro :(', 'OK', {duration: 2000});
      })
  }

  updateBook(b: Book) {
    this.bookService.updateBook(b)
      .then(()=> {
        this.snackBar.open('Livro editado com sucesso', 'OK', {duration: 2000});
        this.bookForm.reset({title: '', id: undefined, authorId: ''});
        this.bookTitle.nativeElement.focus();
      })
      .catch(()=>{
        this.snackBar.open('Falha ao editar o livro :(', 'OK', {duration: 2000});
      })
  }

  edit(b: Book) {
    this.bookForm.setValue(b);
  }

  del(b: Book) {
    this.bookService.deleteBook(b)
      .then(()=> {
        this.snackBar.open('Livro removido com sucesso', 'OK', {duration: 2000});
      })
      .catch(()=>{
        this.snackBar.open('Erro ao remover o livro :(', 'OK', {duration: 2000});
      })
  }

  filter(event: any) {
    this.filterBooks$ = this.bookService.searchByTitle(event.target.value);
  }
}
