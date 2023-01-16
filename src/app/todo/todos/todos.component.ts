import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  constructor(public TodoService: TodoService) { }

  ngOnInit(): void {
  }

  onAddToDo(form: NgForm) {
    const id = Date.now().toString(36);

    this.TodoService.addTodo(id, form.value.message);
    form.resetForm();

  }
}



