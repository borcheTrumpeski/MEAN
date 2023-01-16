import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FullName } from './crud.model';
import { Observable } from 'rxjs';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CrudService {

  fullName: FullName[] = []
  private personUpdate = new Subject<FullName[]>();

  constructor(private http: HttpClient) { }

  getPeopleUpdateListener() {
    return this.personUpdate.asObservable();
  }

  getPeople(): Observable<FullName[]> {
    return this.http
      .get<FullName[]>(
        "http://localhost:3000/api/fullname"
      )
  }

  addPeople(firstName: string, lastName: string) {

    this.http
      .post<{ firstName: string, lastName: string }>("http://localhost:3000/api/firstandlastname", { firstName, lastName })
      .subscribe(res => {

        // this.fullName.push(person)
      })
  }

  deletePeople(person: FullName) {

    this.http.delete<{}>("http://localhost:3000/api/deletebyid/" + person._id).subscribe(() => {
      alert("deleted")
    });
  }

  editPeople(person: FullName) {
    this.http
      .put("http://localhost:3000/api/updateperson/" + person._id, person)
      .subscribe(response => {
        console.log(response)
        // const personUpdate = [...this.fullName];
        // const oldIndex = personUpdate.findIndex(p => p._id === person._id);
        // personUpdate[oldIndex] = person;
        // this.fullName = personUpdate;
        // this.personUpdate.next([...this.fullName]);
      });
  }
}




