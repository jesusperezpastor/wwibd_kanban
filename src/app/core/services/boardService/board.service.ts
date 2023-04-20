import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from '@angular/router';
import { BoardSchema } from '../../models/boardschema';
import { generateUniqueId } from 'src/app/shared/utils/';
import { UserService } from 'src/app/core/services/userService/user.service';
import { ListSchema } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  createBoard(name: string, selectedUsers: any[]): Observable<any> {
    let generatedId = generateUniqueId();
    let generateIdToDo = generateUniqueId();
    let generateIdInProgress = generateUniqueId();
    let generateIdDone = generateUniqueId();

    const lists: ListSchema[] = [
      {
        id: generateIdToDo,
        name: '¿Qué hacer?',
        tasks: [],
      },
      {
        id: generateIdInProgress,
        name: '¡En progreso!',
        tasks: [],
      },
      {
        id: generateIdDone,
        name: '¡Está hecho!',
        tasks: [],
      }
    ];

    const newBoard: BoardSchema = {
      _id: generatedId,
      name: name,
      description: '',
      dateCreation: new Date(),
      createdBy: this.userService.getUser().userEmail,
      cycleTimeStart: '¡En progreso!',
      cycleTimeStartIdList: generateIdInProgress,
      cycleTimeEnd: '¡Está hecho!',
      cycleTimeEndIdList: generateIdDone,
      users: selectedUsers,
      list: lists
    };

    const token = this.userService.getUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>('https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/board/create', newBoard, httpOptions);
  }

  async updateBoard(idBoard: string, idCycleTimeStart: string, idCycleTimeSEnd: string, lists: ListSchema[], usersProject: any[]): Promise<Observable<any>> {
    const token = this.userService.getUser().token;
    let boardOriginal;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    boardOriginal = await this.getBoardById(idBoard).toPromise().catch(err => {
      console.log(err);
      //Notificar al usuario que no se puede recuperar los datos del tablero
    });

    boardOriginal.list = lists;

    boardOriginal.cycleTimeStartIdList = idCycleTimeStart;
    let foundListNameStart = lists.find(list => list.id === idCycleTimeStart);
    boardOriginal.cycleTimeStart = foundListNameStart?.name;

    boardOriginal.cycleTimeEndIdList = idCycleTimeSEnd;
    let foundListNameEnd = lists.find(list => list.id === idCycleTimeSEnd);
    boardOriginal.cycleTimeEnd = foundListNameEnd?.name;

    boardOriginal.users = usersProject;

    return this.http.post<any>('https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/board/update', boardOriginal, httpOptions).toPromise();
  }

  getAllBoards(): Observable<any> {
    const token = this.userService.getUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<any>('http://localhost:3000/api/board/getAllProjects', httpOptions);
  }

  getAllBoardsByUser(userEmail: any): Observable<any> {
    const token = this.userService.getUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<any>(`https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/board/getAllProjectsByUser/${userEmail}`, httpOptions);
  }

  getBoardById(boardId: any): Observable<any> {
    const token = this.userService.getUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<any>(`https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/board/getBoardById/${boardId}`, httpOptions);
  }

  removeBoard(boardId: any): Observable<any> {
    const token = this.userService.getUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<any>(`https://wwibd-server-api-image-7qbwpnju7a-uc.a.run.app/api/board/deleteBoardById/${boardId}`, httpOptions);
  }
}