import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialCdkModule } from "./../material-cdk/material-cdk.module";

import { RouterModule } from '@angular/router';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDeleteListComponent } from './components/modal-delete-list/modal-delete-list.component';
import { ModalAuxAppComponent } from './components/modal-aux-app/modal-aux-app.component';
import { ModalInfoTaskComponent } from './components/modal-info-task/modal-info-task.component';
import { ModalDeleteBoardComponent } from './components/modal-delete-board/modal-delete-board.component';

const declarables = [HeaderComponent, FooterComponent, ModalComponent, LoginComponent, ModalDeleteListComponent, ModalAuxAppComponent];

@NgModule({
  declarations: [declarables, ModalInfoTaskComponent, ModalDeleteBoardComponent],
  imports: [
    CommonModule,
    MaterialCdkModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: declarables
})
export class SharedModule { }
