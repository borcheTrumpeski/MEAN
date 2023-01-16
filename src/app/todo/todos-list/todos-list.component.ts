import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';

import { TODO } from '../todo.model';


@Component({
  selector: 'app-todos-list',
  templateUrl: './todos-list.component.html',
  styleUrls: ['./todos-list.component.css']
})

export class TodosListComponent implements OnInit, OnDestroy {
  todos: TODO[] = []
  todoEdit: TODO = { id: "", message: "" }

  private toDoSub = new Subscription;
  isOpened: boolean = false;
  isValid: boolean = false;
  editingIndex: number = 0;

  toDoForm = new FormGroup({
    todo: new FormControl('', Validators.required)
  });

  constructor(public TodoService: TodoService) {

  }

  ngOnInit() {
    this.TodoService.getToDos();
    this.toDoSub = this.TodoService.getTodoUpdateListener()
      .subscribe((todos: TODO[]) => {
        this.todos = todos;
      });
  }

  ngOnDestroy() {
    this.toDoSub.unsubscribe();
  }

  onRemoveToDo(todo: TODO) {
    this.TodoService.removeToDo(todo.id)
  }
  onEditToDo(index: number) {

    this.isOpened = true
    this.editingIndex = index;

  }
  onChangeEdit(newMessage: string, index: number) {

    this.todoEdit = { id: index.toString(), message: newMessage }

  }

  onBtnSave() {
    let index = this.todos.findIndex(x => x.id = this.todoEdit.id)
    this.todos[index] = this.todoEdit
    this.TodoService.editToDo(this.todoEdit)
    this.toDoForm.reset()
    this.isOpened = !this.isOpened

  }


  isOpen() {
    return this.isOpened;
  }


}
