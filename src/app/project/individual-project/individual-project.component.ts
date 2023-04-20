import { Component, Input, OnInit } from '@angular/core';
import { BoardSchema } from 'src/app/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalDeleteBoardComponent } from 'src/app/shared/components/modal-delete-board/modal-delete-board.component';

@Component({
  selector: 'app-individual-project',
  templateUrl: './individual-project.component.html',
  styleUrls: ['./individual-project.component.scss']
})

export class IndividualProjectComponent implements OnInit {
  @Input()
  board!: BoardSchema;

  countTasks = 0;
  dateString = '';

  constructor(private router: Router,
    public dialog: MatDialog,) {
  }

  ngOnInit(): void {
    for (let i = 0; i < this.board.list.length; i++) {
      this.countTasks = this.countTasks + this.board.list[i].tasks.length;
    }
  }

  onClick(boardId: any) {
    this.router.navigate(["board", boardId]);
  }

  removeBoard(boardId: string): void {
    const config = new MatDialogConfig();
    config.data = {
      boardId: boardId,
    };

    const dialogRef = this.dialog.open(ModalDeleteBoardComponent, config);
  }
}
