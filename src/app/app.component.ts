import { Component, OnInit, ViewChild } from '@angular/core';
import { MapViewComponent } from './map/map-view';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularArcGisAPI';

  ngOnInit(): any {}
}
