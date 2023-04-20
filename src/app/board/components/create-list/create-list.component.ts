import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSchema } from 'src/app/core/';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ListService } from 'src/app/core/services/listService/list.service';
import { generateUniqueId } from 'src/app/shared/utils/';

type DropdownObject = {
  value: string;
  viewValue: string;
};

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})

export class CreateListComponent implements OnInit {
  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;
  createList!: FormGroup;
  selectedPriority!: string;
  formText!: string;
  formButtonText!: string;

  @Input()
  connectedOverlay!: CdkConnectedOverlay;
  @Input() listId?: string;
  @Input() list?: ListSchema;

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private listService: ListService) { }

  ngOnInit(): void {
    this.setForm();
    if (this.list && this.list.id && this.list.id.length > 0) {
      this.setValuesOnForm(this.list);
      this.formText = 'Editar el nombre de la columna';
      this.formButtonText = 'Editar';
    } else {
      this.formText = 'Crear una nueva columna';
      this.formButtonText = 'Añadir';
    }
  }

  setForm(): void {
    this.createList = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onFormAdd(form: any): void {
    console.log(this.list)
    if (this.createList.valid && this.list && !this.list.id) {
      form.id = generateUniqueId();
      this.listService.addList(form);
    } else if (this.list) {
      form.id = this.list.id;
      form.tasks = this.list.tasks;
      this.listService.updateList(form);
    }
    this.close();
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  close(): void {
    this.connectedOverlay.overlayRef.detach();
  }

  setValuesOnForm(form: ListSchema): void {
    this.createList.setValue({
      name: form.name
    });
  }
}
