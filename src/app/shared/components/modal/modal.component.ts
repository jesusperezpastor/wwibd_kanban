import { Component, AfterViewInit, TemplateRef, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialogRef } from '@angular/material/dialog';
import { ListSchema } from './../../../core';
import { ListService } from 'src/app/core/services/listService/list.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  templatePortal!: TemplatePortal<any>;
  taskId: string;
  list: ListSchema;

  constructor(private _viewContainerRef: ViewContainerRef,
    public listService: ListService, 
    private dialogRef: MatDialogRef<ModalComponent>) {
      
    this.taskId = dialogRef._containerInstance._config.data.task;
    this.list = dialogRef._containerInstance._config.data.list;
  }

  ngAfterViewInit(): void {
    this.templatePortal = new TemplatePortal(
      this.templatePortalContent,
      this._viewContainerRef
    );
  }

  closeDialogWithNoAction() {
    this.dialogRef.close();
  }

  closeDialogWithAction() {
    this.listService.removeTask(this.taskId, this.list);
    this.dialogRef.close();
  }
}
