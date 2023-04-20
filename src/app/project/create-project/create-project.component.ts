import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from 'src/app/core/services/boardService/board.service';
import { Router } from '@angular/router'
import { UserSchema } from 'src/app/core';
import { UserService } from 'src/app/core/services/userService/user.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})

export class CreateProjectComponent {
  createProject!: FormGroup;

  // Lista de usuarios
  users: any[] = [];

  selectedUsers: any[] = [];
  createdBydUser: any;
  selectedUser = "";

  @Input()
  connectedOverlay!: CdkConnectedOverlay;

  constructor(private fb: FormBuilder,
    private boardService: BoardService,
    private userService: UserService,) { }

  ngOnInit(): void {
    this.setForm();

    this.userService.getAllUsers().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.users[i] = data[i].email;
      }

      this.createdBydUser = localStorage.getItem('userEmail');
      this.users = this.users.filter(user => user !== localStorage.getItem('userEmail'));
    },
      err => {
        console.log(err);
      })
  }

  setForm(): void {
    this.createProject = this.fb.group({
      name: ['', Validators.required]
    });
  }

  addUser(user: UserSchema) {
    const userExists = this.selectedUsers.find(u => u === user);

    if (!userExists) {
      this.selectedUsers.push(user);
    }

    this.selectedUser = "";
  }

  removeUser(user: UserSchema): void {
    const index = this.selectedUsers.indexOf(user);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    }
  }

  onFormAdd(form: any): void {
    if (this.createProject.valid) {
      this.selectedUsers.push(this.createdBydUser);
      console.log(this.selectedUsers);

      this.boardService.createBoard(form.name, this.selectedUsers).subscribe(data => {
        location.reload();
      },
        err => {
          console.log(err);
        })
    }

    this.close();
  }

  close(): void {
    this.connectedOverlay.overlayRef.detach();
  }
}
