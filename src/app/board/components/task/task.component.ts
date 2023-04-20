import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListSchema, TaskSchema } from './../../../core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ListService } from 'src/app/core/services/listService/list.service';
import { ModalInfoTaskComponent } from 'src/app/shared/components/modal-info-task/modal-info-task.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})

export class TaskComponent implements OnInit {
  @Input()
  task!: TaskSchema;
  @Input() list?: ListSchema;
  @Output() editTask: EventEmitter<TaskSchema> = new EventEmitter();

  constructor(public dialog: MatDialog,
    public listService: ListService) { }

  ngOnInit(): void {

  }

  handleEditTask(task: TaskSchema,) {
    this.editTask.emit(task);
  }

  removeTask(taskId: string): void {
    const config = new MatDialogConfig();
    config.data = {
      task: taskId,
      list: this.list
    };

    const dialogRef = this.dialog.open(ModalComponent, config);
  }

  infoTask(task: TaskSchema): void {
    const config = new MatDialogConfig();
    config.data = {
      task: task,
    };

    const dialogRef = this.dialog.open(ModalInfoTaskComponent, config);
  }
}


