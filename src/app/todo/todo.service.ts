import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { TODO } from './todo.model';



@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: TODO[] = [];
  private todosUpdated = new Subject<TODO[]>();

  constructor(private http: HttpClient) { }

  addTodo(id: string, message: string) {
    const todo: TODO = { id: id, message: message };
    this.http
      .post<{ message: string }>("http://localhost:3000/api/todos", todo)
      .subscribe(responseData => {
        this.todos.push(todo);
        this.todosUpdated.next([...this.todos]);
      });

  }
  getTodoUpdateListener() {
    return this.todosUpdated.asObservable();
  }
  getToDos() {
    this.http
      .get<{ todos: TODO[] }>(
        "http://localhost:3000/api/todos"
      )
      .subscribe(postData => {
        return postData
      });
  }

  removeToDo(todoId: string) {
    this.http
      .delete("http://localhost:3000/api/todos/" + todoId)
      .subscribe(() => {
        const updatedTodos = this.todos.filter(post => post.id !== todoId);
        this.todos = updatedTodos;
        this.todosUpdated.next([...this.todos]);
      });
  }

  editToDo(todo: TODO) {
    // const todo: TODO = { id: id, message: message };
    this.http
      .put("http://localhost:3000/api/todos/" + todo.id, todo)
      .subscribe(response => {

        const updatedTodos = [...this.todos];
        const oldTodoIndex = updatedTodos.findIndex(p => p.id === todo.id);
        updatedTodos[oldTodoIndex] = todo;
        this.todos = updatedTodos;
        // this.todos.push(todo);
        this.todosUpdated.next([...this.todos]);
      });
  }

}
