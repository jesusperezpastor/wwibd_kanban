import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSchema, TaskSchema } from "./../../../core/models";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalDeleteListComponent } from 'src/app/shared/components/modal-delete-list/modal-delete-list.component';
import { ListService } from 'src/app/core/services/listService/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  @Input()
  list!: ListSchema;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();
  @Output() editList: EventEmitter<ListSchema> = new EventEmitter();

  ngOnInit(): void {

  }

  constructor(public listService: ListService,
    public dialog: MatDialog) { }

  drop(event: CdkDragDrop<TaskSchema[]>) {
    const movingItem = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      if (this.list.id == this.listService.gettSelectedCycleTimeStart()) {
        const index = event.container.data.findIndex(item => item.id === movingItem.id);
        event.container.data[index].dateStart = new Date().toUTCString();
        event.container.data[index].cycleTime = "1";
      }

      if (this.list.id == this.listService.gettSelectedCycleTimeEnd() && movingItem.dateStart != "Sin Comenzar") {
        const index = event.container.data.findIndex(item => item.id === movingItem.id);
        event.container.data[index].dateEnd = new Date().toUTCString();

        const dateStart = new Date(Date.parse(event.container.data[index].dateStart));
        const dateEnd = new Date(Date.parse(event.container.data[index].dateEnd));

        const differenceInMilliseconds = Math.abs(dateEnd.getTime() - dateStart.getTime());
        let daysPassed = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        daysPassed = Math.floor(daysPassed);
        event.container.data[index].cycleTime = "" + (daysPassed + 1);
      }
    }
  }

  handleEdit(task: TaskSchema) {
    if (this.list) {
      task.listId = this.list.id;
      this.editTask.emit(task);
    }
  }

  handleEditList(list: ListSchema) {
    this.editList.emit(list);
  }

  handleDeleteList(list: ListSchema) {
    const config = new MatDialogConfig();
    config.data = {
      list: this.list
    };

    const dialogRef = this.dialog.open(ModalDeleteListComponent, config);
  }

  moveListLeft(list: ListSchema) {
    this.listService.moveListLeft(this.list);
  }

  moveListRigth(list: ListSchema) {
    this.listService.moveListRigth(this.list);
  }
}
