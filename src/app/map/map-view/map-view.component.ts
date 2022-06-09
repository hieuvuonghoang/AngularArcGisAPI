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
import LayerList from '@arcgis/core/widgets/LayerList';
import Basemap from '@arcgis/core/Basemap';
import esriConfig from '@arcgis/core/config.js';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/tasks/support/Query';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  private view!: MapView;
  private fLTramBienApDangDiem!: FeatureLayer;
  private fLTramBienApDangVung!: FeatureLayer;
  private fLDuongDayDien!: FeatureLayer;
  private fLCotDien!: FeatureLayer;
  private fLCotDienHighLight: __esri.Handle | null = null;

  private fLView!: __esri.FeatureLayerView;

  private iDFLCotDientHighLight!: number;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  constructor() {}

  private initializeMap(token: string): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const scale = environment.scale;
    const centerPoint = new Point(environment.centerPoint);
    const baseMapUrl = environment.mapUrl.baseMapUrl;
    const mapServerMLDUrl = environment.mapUrl.mapServerMLDUrl;
    const serviceUrls = [baseMapUrl, mapServerMLDUrl];

    //#region  "esriConfig"
    esriConfig.assetsPath = './assets';

    serviceUrls.forEach((element) => {
      esriConfig.request.interceptors?.push({
        urls: element,
        before: function (params) {
          params.requestOptions.query = params.requestOptions.query || {};
          params.requestOptions.query.token = token;
        },
      });
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

    const mapServerMLD = new MapImageLayer({
      url: mapServerMLDUrl,
      title: 'Mạng lưới truyền tải điện',
      sublayers: [
        {
          id: 3,
          title: 'Trạm biến áp dạng vùng',
        },
        {
          id: 1,
          title: 'Đường dây điện',
        },
        {
          id: 2,
          title: 'Cột điện',
        },
        {
          id: 0,
          title: 'Trạm biến áp',
        },
      ],
    });

    const map = new Map({
      basemap: basemap,
      layers: [mapServerMLD],
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

    // mapServerMLD.sublayers.forEach((sublayer) => {
    //   sublayer
    //     .createFeatureLayer()
    //     .then((featureLayer) => {
    //       switch (featureLayer.layerId) {
    //         case 3:
    //           this.fLTramBienApDangVung = featureLayer;
    //           break;
    //         case 2:
    //           this.fLCotDien = featureLayer;
    //           break;
    //         case 1:
    //           this.fLDuongDayDien = featureLayer;
    //           break;
    //         case 0:
    //           this.fLTramBienApDangDiem = featureLayer;
    //           break;
    //       }
    //       console.log('createFeatureLayer: ' + featureLayer.layerId);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // });

    view.when(() => {
      const layerList = new LayerList({
        view: view,
      });
      view.ui.add(layerList, 'top-right');
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
        console.log(this.fLCotDien);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
