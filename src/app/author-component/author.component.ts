import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Author } from '../models/author';
import { AuthorService } from '../services/author.service';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

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

  onSubmit() {
    let a: Author = this.authorForm.value;
    if(!a.id) {
      this.addAuthor(a);
    }
    else {
      this.updateAuthor(a);
    }
  }
  
  addAuthor(a: Author) {
    this.authorService.addAuthor(a)
      .then(()=>{
        this.snackBar.open('Autor criado com sucesso', 'OK', {duration: 2000});
        this.authorForm.reset({name: '', id: undefined});
        this.authorName.nativeElement.focus();
      })
      .catch(()=> {
        this.snackBar.open('Falha na criação do autor :(', 'OK', {duration: 2000});
      })
  }

  updateAuthor(a: Author) {
    this.authorService.updateAuthor(a)
      .then(()=>{
        this.snackBar.open('Autor editado com sucesso', 'OK', {duration: 2000});
        this.authorForm.reset({name: '', id: undefined});
        this.authorName.nativeElement.focus();
      })
      .catch(()=>{
        this.snackBar.open('Falha ao editar o autor :(', 'OK', {duration: 2000});
      })
  }

  edit(a: Author) {
    console.log(a.id);
    this.authorForm.setValue(a);
  }

  del(a: Author) {
    this.authorService.deleteAuthor(a)
      .then(()=>{
        this.snackBar.open('Autor removido com sucesso', 'OK', {duration: 2000});
      })
      .catch(()=>{
        this.snackBar.open('Erro ao remover o autor :(', 'OK', {duration: 2000});
      })
  }

  filter(event: any) {
    this.filterAuthors$ = this.authorService.searchByName(event.target.value);
  }

}
