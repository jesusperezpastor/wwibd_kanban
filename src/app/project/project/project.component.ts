import { Component, OnInit } from '@angular/core';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { BoardSchema } from './../../core';
import { BoardService } from 'src/app/core/services/boardService/board.service';
import { Router } from '@angular/router'
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {
  projects: BoardSchema[] = [];
  isOverlayDisplayed = false;

  readonly overlayOptions: Partial<CdkConnectedOverlay> = {
    hasBackdrop: true,
    positions: [
      { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
    ],
  };

  constructor(
    private router: Router,
    private boardService: BoardService,
    private app: AppComponent) { }

  ngOnInit(): void {
    this.app.showHeader = true;

    this.boardService.getAllBoardsByUser(localStorage.getItem('userEmail')).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let board: BoardSchema = {
          _id: data[i]._id,
          name: data[i].name,
          description: data[i].description,
          dateCreation: data[i].dateCreation,
          createdBy: data[i].createdBy,
          cycleTimeStart: data[i].cycleTimeStart,
          cycleTimeStartIdList: data[i].cycleTimeStartIdList,
          cycleTimeEnd: data[i].cycleTimeEnd,
          cycleTimeEndIdList: data[i].cycleTimeEndIdList,
          users: data[i].users,
          list: data[i].list
        }

        this.projects.push(board);
      }
      this.router.navigate(['/project']);
    },
      err => {
        console.log(err);
      })
  }

  displayOverlay(event?: any): void {
    this.isOverlayDisplayed = true;
  }

  hideOverlay(): void {
    this.isOverlayDisplayed = false;
  }
}
