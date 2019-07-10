import { Component, OnInit } from '@angular/core';
import { Author } from '../models/author';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  name: string;
  author: Author;
  description: string;

  constructor() { }

  ngOnInit() {
  }

  save() {

  }

  clear() {
    
  }

}
