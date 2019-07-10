import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit {
  
  name: string;

  constructor() { }

  ngOnInit() {
  }

  save() {

  }

  clear() {
    
  }

}
