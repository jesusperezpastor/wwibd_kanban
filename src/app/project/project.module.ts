import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project/project.component';
import { SharedModule } from "../shared/shared.module";
import { CreateProjectComponent } from './create-project/create-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialCdkModule } from "./../material-cdk/material-cdk.module";
import { IndividualProjectComponent } from './individual-project/individual-project.component';

@NgModule({
    declarations: [
        ProjectComponent,
        CreateProjectComponent,
        IndividualProjectComponent
    ],
    imports: [
        CommonModule,
        ProjectRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialCdkModule
    ]
})
export class ProjectModule { }
