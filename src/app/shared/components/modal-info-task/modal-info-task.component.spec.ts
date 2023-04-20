import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoTaskComponent } from './modal-info-task.component';

describe('ModalInfoTaskComponent', () => {
  let component: ModalInfoTaskComponent;
  let fixture: ComponentFixture<ModalInfoTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInfoTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInfoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
