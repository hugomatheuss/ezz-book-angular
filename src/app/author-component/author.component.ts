import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Author } from '../models/author';
import { AuthorService } from '../services/author.service';
import { MatSnackBar } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {

  authors$: Observable<Author[]>;
  filterAuthors$: Observable<Author[]>;
  displayedColumns = ['name', 'operations'];

  @ViewChild('name', {static: false}) authorName: ElementRef;

  authorForm = this.fb.group({
    id: [undefined],
    name: ['', [Validators.required]],    
  });

  constructor(
    private authorService: AuthorService, 
    private fb: FormBuilder, 
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.authors$ = this.authorService.getAuthors();   
  }

  

}
