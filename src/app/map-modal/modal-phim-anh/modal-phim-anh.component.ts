import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable } from 'rxjs';
import { PhimAnh } from 'src/app/models/phim-anh';
import { PhimAnhService } from 'src/app/services/phim-anh.service';

@Component({
  selector: 'app-modal-phim-anh',
  templateUrl: './modal-phim-anh.component.html',
  styleUrls: ['./modal-phim-anh.component.css'],
})
export class ModalPhimAnhComponent implements OnInit {
  @ViewChild('videoTag')
  videoTag!: ElementRef;
  public event: any;
  public maDTQS: string = '';
  public phimAnhs: PhimAnh[] = [];
  public images: string[] = [];
  public videos: string[] = [];

  constructor(
    private _activeModal: NgbActiveModal,
    private _phimAnhService: PhimAnhService
  ) {}

  ngOnInit(): void {}

  onClose() {
    this._activeModal.close('close');
  }
}
