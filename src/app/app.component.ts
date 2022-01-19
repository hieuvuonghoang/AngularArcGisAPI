import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import esriId from '@arcgis/core/identity/IdentityManager';
import ServerInfo from '@arcgis/core/identity/ServerInfo';

import MapView from '@arcgis/core/views/MapView';
import TileInfo from '@arcgis/core/layers/support/TileInfo';
import Map from '@arcgis/core/Map';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import Point from '@arcgis/core/geometry/Point';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';

import Basemap from '@arcgis/core/Basemap';
import esriConfig from '@arcgis/core/config.js';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  ngOnInit(): any {}

  openSlideBarPhimAnh(event: any) {
    if (event && !this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = true;
    } else if (!event && this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = false;
    }
  }
}
