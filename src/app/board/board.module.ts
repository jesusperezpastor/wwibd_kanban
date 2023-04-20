import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board/board.component';
import { ListComponent } from './components/list/list.component';
import { TaskComponent } from './components/task/task.component';
import { MaterialCdkModule } from "./../material-cdk/material-cdk.module";
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateListComponent } from './components/create-list/create-list.component';
import { SharedModule } from "../shared/shared.module";
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
    declarations: [
        BoardComponent,
        ListComponent,
        TaskComponent,
        CreateTaskComponent,
        CreateListComponent,
    ],
    imports: [
        CommonModule,
        BoardRoutingModule,
        MaterialCdkModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MatTooltipModule,
        NgChartsModule,
        NgApexchartsModule
    ]
})
export class BoardModule { }
