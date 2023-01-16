import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrudService } from '../crud.service';
import { FullName } from '../crud.model';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-crud-create',
  templateUrl: './crud-create.component.html',
  styleUrls: ['./crud-create.component.css']
})
export class CrudCreateComponent implements OnInit, OnDestroy {

  fullName: FullName[] = []
  fullNameEdit: FullName = { _id: "", firstName: "", lastName: "" }
  fullNameSubs = new Subscription;
  editIndex: number = 0;
  isOpened: boolean = false;
  isValid: boolean = false;

  toDoForm = new FormGroup({
    ppl: new FormControl('', Validators.required)
  });

  constructor(public CrudService: CrudService) { }

  ngOnInit(): void {
    this.onGetPeople()
    this.fullNameSubs = this.CrudService.getPeopleUpdateListener()
      .subscribe((fullName: FullName[]) => {
        this.fullName = fullName;
      });
  }

  ngOnDestroy() {
    this.fullNameSubs.unsubscribe();
  }

  onGetPeople() {
    this.CrudService.getPeople().subscribe((res) => {
      this.fullName = res;
    })
  }

  onAddPeople(form: NgForm) {
    this.CrudService.addPeople(form.value.firstName, form.value.lastName)
    form.resetForm();
  }

  onDeletePeople(fullName: FullName) {
    this.CrudService.deletePeople(fullName)
  }

  onEditPeople(FullName: FullName) {

    this.fullNameEdit = FullName;
  }

  onChangeEditFirst(newFirst: string) {
    this.fullNameEdit.firstName = newFirst
  }
  onChangeEditLast(newLast: string) {
    this.fullNameEdit.lastName = newLast
  }

  onBtnSave() {

    this.CrudService.editPeople(this.fullNameEdit)
    this.fullNameEdit = { _id: "", firstName: "", lastName: "" }
  }

  isOpen() {
    return this.isOpened;
  }
  isOpenEdit() {
    return this.editIndex;
  }

}
