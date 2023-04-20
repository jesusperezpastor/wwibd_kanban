import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskSchema } from 'src/app/core';

@Component({
  selector: 'app-modal-info-task',
  templateUrl: './modal-info-task.component.html',
  styleUrls: ['./modal-info-task.component.scss']
})
export class ModalInfoTaskComponent {
  @ViewChild('templatePortalContent')
  templatePortalContent!: TemplateRef<unknown>;

  task!: TaskSchema;
  startTime!: string;
  endTime!: string;

  constructor(private _viewContainerRef: ViewContainerRef, private dialogRef: MatDialogRef<ModalInfoTaskComponent>) {
    this.task = dialogRef._containerInstance._config.data.task;

    if (this.task.dateStart != "Sin Comenzar") {
      let start = new Date(this.task.dateStart);
      this.startTime = (start.getDate() < 10 ? '0' : '') + start.getDate() + '/' + ((start.getMonth() + 1) < 10 ? '0' : '') + (start.getMonth() + 1)
        + '/' + start.getFullYear() + ' ' + (start.getHours() < 10 ? '0' : '') + start.getHours() + ':' + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
    } else {
      this.startTime = this.task.dateStart;
    }


    if (this.task.dateEnd != "Sin Comenzar") {
      let end = new Date(this.task.dateEnd);
      this.endTime = (end.getDate() < 10 ? '0' : '') + end.getDate() + '/' + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1)
        + '/' + end.getFullYear() + ' ' + (end.getHours() < 10 ? '0' : '') + end.getHours() + ':' + (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
    } else {
      this.endTime = this.task.dateEnd;
    }

    if (this.task.cycleTime === undefined) {
      this.task.cycleTime = "Sin Calcular"
    }    
  }
}
