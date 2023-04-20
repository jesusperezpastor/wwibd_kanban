import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteBoardComponent } from './modal-delete-board.component';

describe('ModalDeleteBoardComponent', () => {
  let component: ModalDeleteBoardComponent;
  let fixture: ComponentFixture<ModalDeleteBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeleteBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
