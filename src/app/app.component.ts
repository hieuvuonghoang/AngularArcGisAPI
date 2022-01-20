import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopupPhimAnh } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularArcGisAPI';
  openedSlideBar = false;
  openedSlideBarPhimAnh = false;
  showPopupPhimAnh = false;
  popupPhimAnh!: PopupPhimAnh;

  ngOnInit(): any {}

  openSlideBarPhimAnh(event: any) {
    if (event && !this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = true;
    } else if (!event && this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = false;
    }
  }

  openPopupPhimAnh(event: PopupPhimAnh) {
    if (
      (this.popupPhimAnh &&
        this.popupPhimAnh.isShow &&
        event.isShow &&
        this.popupPhimAnh.iD == event.iD) ||
      (this.popupPhimAnh && !this.popupPhimAnh.isShow && !event.isShow)
    ) {
      return;
    }
    this.popupPhimAnh = event;
    const el = document.getElementById('app-map-view')!;
    if (this.popupPhimAnh.screenCoordinate.y + 124 > el.clientHeight) {
      this.popupPhimAnh.screenCoordinate.y -= 124;
    }
    if (this.popupPhimAnh.screenCoordinate.x + 300 > el.clientWidth) {
      this.popupPhimAnh.screenCoordinate.x -= 300;
    }
  }
}
