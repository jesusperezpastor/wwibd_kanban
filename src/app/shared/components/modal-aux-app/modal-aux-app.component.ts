import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-aux-app',
  templateUrl: './modal-aux-app.component.html',
  styleUrls: ['./modal-aux-app.component.scss']
})

export class ModalAuxAppComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  templatePortal!: TemplatePortal<any>;
  text!: string;
  textLittle!: string;

  constructor(private _viewContainerRef: ViewContainerRef, private dialogRef: MatDialogRef<ModalAuxAppComponent>) {
    this.text = dialogRef._containerInstance._config.data.text;
    this.textLittle = dialogRef._containerInstance._config.data.textLittle;
  }

  ngAfterViewInit(): void {
    this.templatePortal = new TemplatePortal(
      this.templatePortalContent,
      this._viewContainerRef
    );
  }
}
