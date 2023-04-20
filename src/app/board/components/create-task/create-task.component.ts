import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { TaskSchema } from 'src/app/core/';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ListService } from 'src/app/core/services/listService/list.service';
import { generateUniqueId } from 'src/app/shared/utils/';

type DropdownObject = {
  value: string;
  viewValue: string;
};

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})

export class CreateTaskComponent implements OnInit {
  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;
  createTask!: FormGroup;
  selectedPriority!: string;
  selectedType!: string;
  formText!: string;
  modeComponent!: string;
  notStartAux = "Sin Comenzar";

  @Input()
  connectedOverlay!: CdkConnectedOverlay;
  @Input() task?: TaskSchema;
  @Input() listId?: string;

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private listService: ListService
  ) { }

  priorities: DropdownObject[] = [
    { value: 'low', viewValue: 'Bajo' },
    { value: 'moderate', viewValue: 'Moderado' },
    { value: 'urgent', viewValue: 'Urgente' },
  ];

  types: DropdownObject[] = [
    { value: 'Historia de Usuario', viewValue: 'Historia de Usuario' },
    { value: 'Tarea Técnica', viewValue: 'Tarea Técnica' },
    { value: 'Característica', viewValue: 'Característica' },
    { value: 'Bug', viewValue: 'Bug' },
    { value: 'Requisito no Funcional', viewValue: 'Requisito no Funcional' },
    { value: 'Mejora', viewValue: 'Mejora' },
    { value: 'Documentación', viewValue: 'Documentación' },
  ];

  ngOnInit(): void {
    this.setForm();
    this.selectedPriority = '';
    this.selectedType = '';

    if (this.task && this.task.id && this.task.id.length > 0) {
      this.setValuesOnForm(this.task);
      this.formText = 'Editar la Tarea';
      this.selectedPriority = this.task.priority;
      this.selectedType = this.task.type;
      this.modeComponent = 'editar'
    } else {
      this.formText = 'Crear una nueva Tarea';
      this.modeComponent = 'crear'
    }
  }

  setForm(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    this.createTask = this.fb.group({
      name: ['', Validators.required],
      type: ['userStory', Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['low', Validators.required],
      description: ['', Validators.required],
      dateCreation: [formattedDate],
      dateStart: ["Sin Comenzar"],
      dateEnd: ["Sin Comenzar"],
    });
  }

  onFormAdd(form: TaskSchema): void {
    if (this.createTask.valid && this.task && !this.task.id) {
      form.id = generateUniqueId();
      this.listService.addTask(form);
      this.close();
    } else if (this.task && this.listId) {
      const findPriority = this.priorities.find(
        (element) => form.priority === element.value
      );

      const findType = this.types.find(
        (element) => form.type === element.value
      );

      form.id = this.task.id;
      form.type = !findType ? this.task.type : form.type;
      form.priority = !findPriority ? this.task.priority : form.priority;
      form.dateStart = this.task.dateStart;
      form.dateEnd = this.task.dateEnd;
      form.cycleTime = this.task.cycleTime;

      if (form.priority) {
        this.listService.updateTask(form, this.listId);
      }

      this.close();
    }
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  close(): void {
    this.connectedOverlay.overlayRef.detach();
  }

  setValuesOnForm(form: TaskSchema): void {
    this.createTask.setValue({
      name: form.name,
      type: form.type,
      assignedTo: form.assignedTo,
      priority: form.priority,
      description: form.description,
      dateCreation: form.dateCreation,
      dateStart: form.dateStart,
      dateEnd: form.dateEnd,
    });
  }
}
