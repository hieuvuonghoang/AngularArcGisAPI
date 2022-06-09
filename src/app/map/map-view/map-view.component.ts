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
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/tasks/support/Query";
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import * as identify from "@arcgis/core/rest/identify";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  private view!: MapView;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  constructor() {}

  private initializeMap(token: string): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const scale = environment.scale;
    const centerPoint = new Point(environment.centerPoint);
    const baseMapUrl = environment.mapUrl.baseMapUrl;
    const mapServerMLDUrl = environment.mapUrl.mapServerMLDUrl;
    const serviceUrls = [
      baseMapUrl,
      mapServerMLDUrl
    ];

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
      title: "Mạng lưới truyền tải điện",
      sublayers: [
        {
          id: 3,
          title: "Trạm biến áp dạng vùng",
        },
        {
          id: 1,
          title: "Đường dây điện",
        },
        {
          id: 2,
          title: "Cột điện",
        },
        {
          id: 0,
          title: "Trạm biến áp",
        },
      ],
    });

    const map = new Map({
      basemap: basemap,
    });
    map.add(mapServerMLD)

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

    view.when(() => {
      const layerList = new LayerList({
        view: view,
      });

      // Add widget to the top right corner of the view
      view.ui.add(layerList, 'top-right');
    });

    this.view = view;

    return this.view.when();
  }

  private highLight(event: any) {
    let params = new IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = [0, 1, 2, 3];
    params.layerOption = "all";
    params.width = this.view.width;
    params.height = this.view.height;
    params.geometry = this.view.toMap(event);
    params.mapExtent = this.view.extent;
    params.returnGeometry = true;
    params.returnFieldName = false;
    identify.identify(environment.mapUrl.mapServerMLDUrl, params)
    .then((response) => {
      let results = response.results;
      if(results.length != 0) {
        setTimeout(() => {
          this.changeMouseCursor('pointer');
        })
        for(let i = 0; i < results.length; i++) {
          if(results[i].layerId == 2) {
            const feature = results[i].feature;
            const _highlightPoint = new SimpleMarkerSymbol({
              size: '9px',
              outline: {
                color: [255, 204, 0, 0.8],
                width: 3,
              },
            });
            this.view.graphics.removeAll();
            feature.symbol = _highlightPoint;
            this.view.graphics.add(feature);
          }
        }
      }
      console.log(results);
    }).catch(err => {
      console.log(err); 
    }).finally(() => {
    });
  }

  ngOnInit(): void {
    const serverInfo = new ServerInfo(environment.serverInfo);
    const userInfo = environment.userInfo;
    from(esriId.generateToken(serverInfo, userInfo)).subscribe((result) => {
      from(this.initializeMap(result.token)).subscribe(() => {
        console.log('The map is ready.');
        this.view.on("pointer-move", (event) => {
          this.changeMouseCursor('default');
          this.view.graphics.removeAll();
        });
        this.view.on("pointer-move", ["Shift"], (event) => {
          this.highLight(event);
        });
      });
    });
  }

  private changeMouseCursor(cursor: string) {
    this.mapViewEl.nativeElement.style.cursor = cursor;
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
