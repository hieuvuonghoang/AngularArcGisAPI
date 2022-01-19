import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
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
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  view!: MapView;
  fLPhimAnh!: FeatureLayer;
  fLViewPhimAnh!: __esri.FeatureLayerView;
  fLPhimAnhHighLight: __esri.Handle | null = null;
  iDFLPhimAnhHighLight!: number;
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  @Output() onClickPhimAnhEvent = new EventEmitter<boolean>();

  constructor() {}

  initializeMap(token: string): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const scale = environment.scale;
    const centerPoint = new Point(environment.centerPoint);
    const baseMapUrl = environment.mapUrl.baseMapUrl;
    const layerPhimAnhUrl = environment.mapUrl.layerPhimAnhUrl;

    //#region  "esriConfig"
    esriConfig.assetsPath = './assets';

    esriConfig.request.interceptors?.push({
      urls: baseMapUrl,
      before: function (params) {
        params.requestOptions.query = params.requestOptions.query || {};
        params.requestOptions.query.token = token;
      },
    });

    esriConfig.request.interceptors?.push({
      urls: layerPhimAnhUrl,
      before: function (params) {
        params.requestOptions.query = params.requestOptions.query || {};
        params.requestOptions.query.token = token;
      },
    });
    //#endregion

    const basemap = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: baseMapUrl,
        }),
      ],
      title: 'Bản đồ nền',
    });

    const layerPhimAnh = new FeatureLayer({
      url: environment.mapUrl.layerPhimAnhUrl,
    });

    const map = new Map({
      basemap: basemap,
      layers: [layerPhimAnh],
    });

    const view = new MapView({
      container: container,
      map: map,
      constraints: {
        lods: TileInfo.create().lods,
      },
      scale: scale,
      center: centerPoint,
      spatialReference: { wkid: 3405 },
      highlightOptions: {
        color: 'orange',
      },
    });

    view.whenLayerView(layerPhimAnh).then((layerView) => {
      this.fLViewPhimAnh = layerView;
      this.fLPhimAnh = layerView.layer;
    });

    this.view = view;

    return this.view.when();
  }

  ngOnInit(): void {
    const serverInfo = new ServerInfo(environment.serverInfo);
    const userInfo = environment.userInfo;
    from(esriId.generateToken(serverInfo, userInfo)).subscribe((result) => {
      from(this.initializeMap(result.token)).subscribe(() => {
        console.log('The map is ready.');
        this.view.on('pointer-move', (event) => {
          this.highLightPhimAnh(event);
        });
        this.view.on('pointer-down', (event) => {
          this.highLightPhimAnh(event);
        });
        this.view.on('click', (event) => {
          this.onClickFLPhimAnh(event);
        });
      });
    });
  }

  onClickFLPhimAnh(event: any) {
    const opts = {
      include: this.fLPhimAnh,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        const graphic = response.results[0].graphic;
        const attributes = graphic.attributes;
        console.log(attributes);
        this.onClickPhimAnhEvent.emit(true);
      } else {
        this.onClickPhimAnhEvent.emit(false);
      }
    });
  }

  changeMouseCursor(cursor: string) {
    this.mapViewEl.nativeElement.style.cursor = cursor;
  }

  highLightPhimAnh(event: any) {
    const opts = {
      include: this.fLPhimAnh,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        this.changeMouseCursor('pointer');
        const graphic = response.results[0].graphic;
        const iD = graphic.attributes.OBJECTID;
        if (this.fLPhimAnhHighLight && this.iDFLPhimAnhHighLight !== iD) {
          this.fLPhimAnhHighLight.remove();
          this.fLPhimAnhHighLight = null;
          return;
        }
        if (this.fLPhimAnhHighLight) {
          return;
        }
        this.fLPhimAnhHighLight = this.fLViewPhimAnh.highlight(iD);
        this.iDFLPhimAnhHighLight = iD;
      } else {
        this.changeMouseCursor('default');
        if (this.fLPhimAnhHighLight) {
          this.fLPhimAnhHighLight.remove();
          this.fLPhimAnhHighLight = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
