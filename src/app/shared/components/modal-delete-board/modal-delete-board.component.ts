import { TemplatePortal } from '@angular/cdk/portal';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BoardService } from 'src/app/core/services/boardService/board.service';

@Component({
  selector: 'app-modal-delete-board',
  templateUrl: './modal-delete-board.component.html',
  styleUrls: ['./modal-delete-board.component.scss']
})

export class ModalDeleteBoardComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  templatePortal!: TemplatePortal<any>;
  boardId!: string;

  constructor(private _viewContainerRef: ViewContainerRef,
    private dialogRef: MatDialogRef<ModalDeleteBoardComponent>,
    public boardService: BoardService,) {

    this.boardId = dialogRef._containerInstance._config.data.boardId;
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
    try {
      this.boardService.removeBoard(this.boardId);
      location.reload();
    } catch (err) {
      console.log(err);
    }
    this.dialogRef.close();
  }
}
