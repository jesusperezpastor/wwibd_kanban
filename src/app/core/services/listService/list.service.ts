import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, BoardSchema, ListSchema, TaskSchema } from '../..';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalAuxAppComponent } from 'src/app/shared/components/modal-aux-app/modal-aux-app.component';
import { BoardService } from 'src/app/core/services/boardService/board.service';

@Injectable({
  providedIn: 'root'
})

export class ListService {
  private readonly boardList = new BehaviorSubject<ListSchema[]>([]);
  readonly list$ = this.boardList.asObservable();
  readonly getBoardList$ = this.list$.pipe(map((list) => list));

  private listsCurrent: ListSchema[] = [];
  private boardId!: string;
  private selectedCycleTimeStart!: string;
  private selectedCycleTimeEnd!: string;

  constructor(public dialog: MatDialog,
    private boardService: BoardService) {
    //this.loadInitialData();
  }

  loadInitialData(): any {
    return this.boardService.getBoardById(this.boardId).subscribe((response: BoardSchema) => {
      if (!!response) {
        response.list.forEach(list => {
          list.tasks.forEach(task => {
            if (task.dateStart != "Sin Comenzar" && task.dateEnd == "Sin Comenzar") {
              let currentDate = new Date().toUTCString();
              let currentDateAux = new Date(Date.parse(currentDate));
              let dateStart = new Date(Date.parse(task.dateStart));
              const differenceInMilliseconds = Math.abs(currentDateAux.getTime() - dateStart.getTime());
              
              let daysPassed = differenceInMilliseconds / (1000 * 60 * 60 * 24);
              daysPassed = Math.floor(daysPassed);
              
              task.cycleTime = "" + (daysPassed + 1);
            }
          })
        });

        this.boardList.next(response['list']);
      }
    });
  }

  get list(): ListSchema[] {
    return this.boardList.getValue();
  }

  set list(value: ListSchema[]) {
    this.boardList.next(value);
  }

  setBoardId(id: string) {
    this.boardId = id;
  }

  setSelectedCycleTimeStart(selectedCycleTimeStart: string) {
    this.selectedCycleTimeStart = selectedCycleTimeStart;
  }

  gettSelectedCycleTimeStart() {
    return this.selectedCycleTimeStart;
  }

  setselectedCycleTimeEnd(selectedCycleTimeEnd: string) {
    this.selectedCycleTimeEnd = selectedCycleTimeEnd;
  }

  gettSelectedCycleTimeEnd() {
    return this.selectedCycleTimeEnd;
  }

  //List Section
  addList(data: ListSchema): void {
    this.listsCurrent = this.list;

    const myNewList: ListSchema = {
      id: data.id,
      name: data.name,
      tasks: []
    }

    this.listsCurrent.push(myNewList);
    this.list = this.listsCurrent;
  }

  updateList(data: ListSchema): void {
    if (data) {
      const elementsIndex = this.boardList.getValue().findIndex((element) => element.id === data.id);
      let list = this.boardList.getValue();
      list[elementsIndex] = data;
      this.boardList.next(list);
    }
  }

  removeList(list: ListSchema): void {
    if (this.hasTasks(list)) {
      const config = new MatDialogConfig();
      let taskGrammar;

      if (list.tasks.length == 1) {
        taskGrammar = "tarea";
      } else {
        taskGrammar = "tareas";
      }

      config.data = {
        text: "No es posible eliminar la columna porque contiene " + list.tasks.length + " " + taskGrammar,
        textLittle: "Elimina o desplaza las tareas de su interior para poder eliminar la columa"
      };

      const dialogRef = this.dialog.open(ModalAuxAppComponent, config);
    } else {
      const listId = list.id;
      this.list = this.list.filter((list) => list.id !== listId);
    }
  }

  moveListRigth(data: ListSchema): void {
    const elementsIndex = this.list.findIndex(
      (element) => element.id === data.id
    );

    if (elementsIndex != (this.list.length - 1)) {
      const element = this.list[elementsIndex];
      this.list.splice(elementsIndex, 1);
      this.list.splice(elementsIndex + 1, 0, element);
    }
  }

  moveListLeft(data: ListSchema): void {
    const elementsIndex = this.list.findIndex(
      (element) => element.id === data.id
    );

    if (elementsIndex != 0) {
      const element = this.list[elementsIndex];
      this.list.splice(elementsIndex, 1);
      this.list.splice(elementsIndex - 1, 0, element);
    }
  }
  //End of List Section

  //Task Section
  addTask(data: TaskSchema): void {
    const card = data;
    const elementsIndex = this.list.findIndex(
      (element) => element.id === '1'
    );

    console.log(this.list[0])
    this.list[0].tasks.push(card);
  }

  updateTask(data: TaskSchema, listId: string): void {
    if (data) {
      const elementsIndex = this.list.findIndex(
        (element) => element.id === listId
      );
      const task = this.list[elementsIndex].tasks.map((element) => {
        if (element.id === data.id) {
          element.name = data.name;
          element.type = data.type;
          element.assignedTo = data.assignedTo;
          element.priority = data.priority;
          element.description = data.description;
          element.dateDeserve = new Date(data.dateDeserve);
          element.tag = data.tag;
        }

        return element;
      });
    }
  }

  removeTask(dataId: string, list: ListSchema): void {
    const elementsIndex = this.list.findIndex(
      (element) => element.id == list.id
    );
    const tasks = this.list[elementsIndex].tasks.filter(
      (task) => task.id !== dataId
    );
    this.list[elementsIndex].tasks = tasks;
  }

  hasTasks(list: ListSchema): boolean {
    return list.tasks.length > 0;
  }
  //End of Task Section

}

