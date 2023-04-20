import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialogRef } from '@angular/material/dialog';
import { ListSchema } from './../../../core';
import { ListService } from 'src/app/core/services/listService/list.service';

@Component({
  selector: 'app-modal-delete-list',
  templateUrl: './modal-delete-list.component.html',
  styleUrls: ['./modal-delete-list.component.scss']
})

export class ModalDeleteListComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  templatePortal!: TemplatePortal<any>;
  list: ListSchema;
  formText!: string;

  constructor(private _viewContainerRef: ViewContainerRef, public listService: ListService, private dialogRef: MatDialogRef<ModalDeleteListComponent>) {
    this.list = dialogRef._containerInstance._config.data.list;
    this.formText = this.list.name;
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
    this.listService.removeList(this.list);
    this.dialogRef.close();
  }
}
