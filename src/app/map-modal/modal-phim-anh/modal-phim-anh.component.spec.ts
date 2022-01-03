import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPhimAnhComponent } from './modal-phim-anh.component';

describe('ModalPhimAnhComponent', () => {
  let component: ModalPhimAnhComponent;
  let fixture: ComponentFixture<ModalPhimAnhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPhimAnhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPhimAnhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
