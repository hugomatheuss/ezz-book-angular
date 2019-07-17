import { Component, OnInit } from '@angular/core';
import { Author } from '../author';
import { AuthorService } from '../author.service';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  authorName: string = '';
  authors: Author[] = [];
  authorEdit = null;
  private unsubscribe: Subject<any> = new Subject();

  constructor(private authorService: AuthorService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authorService.get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((authors) => this.authors = authors);
  }

  save() {
    if (this.authorEdit) {
      this.authorService.update({
        name: this.authorName, 
        _id: this.authorEdit._id,
        books: this.authorEdit.books
      }).subscribe(
        (author) => {
          this.notify('Updated!');
        },
        (err) => {
          this.notify('Error'!);
          console.error(err);
        } 
      )
    }
    else {
      this.authorService.add({ 
        name: this.authorName,
        books: this.books
      })
        .subscribe(
          (author) => {
            console.log(author);
            this.notify('Inserted!');
            this.clearFields();
          },
          (err) => console.error(err)
        )
    }
  }

  clearFields() {
    this.authorName = '';
    this.authorEdit = null;
  }

  cancel() {

  }

  delete(a: Author) {
    this.authorService.del(a)
      .subscribe(
        () => this.notify('Removed!'),
        (err) => console.log(err)
      );
  }

  edit(a: Author) {
    this.authorName = a.name;
    this.authorEdit = a;
  }

  notify(msg: string) {
    this.snackBar.open(msg, "OK", { duration: 3000 });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
  }

}
