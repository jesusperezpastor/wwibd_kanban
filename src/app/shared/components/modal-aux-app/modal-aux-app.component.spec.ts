import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAuxAppComponent } from './modal-aux-app.component';

describe('ModalAuxAppComponent', () => {
  let component: ModalAuxAppComponent;
  let fixture: ComponentFixture<ModalAuxAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAuxAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAuxAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
