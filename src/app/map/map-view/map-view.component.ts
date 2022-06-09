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
import { debounceTime, delay, distinctUntilChanged, from, fromEvent, interval, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/tasks/support/Query";
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import * as identify from "@arcgis/core/rest/identify";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Layer from "@arcgis/core/layers/Layer";
import Portal from "@arcgis/core/portal/Portal";
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource";
import Expand from "@arcgis/core/widgets/Expand";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  private _view!: MapView;
  private _fLCotDien!: FeatureLayer;
  private _fLTramBienAp!: FeatureLayer;
  private _fLDuongDayDien!: FeatureLayer;
  private _fLTranBienApDangVung!: FeatureLayer;

  @ViewChild('mapViewNode', { static: false }) private mapViewEl!: ElementRef;

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

    esriConfig.apiKey =
      'AAPKce6c0d7d41324b7498260898e4d28dc5QHG_Ioa_24tLd-SvgR914a7rGUOOciRlTgbojWFzNxZ3yVHl_CHJWzbf4XhoXxF5';

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

    const baseMapOne = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: baseMapUrl,
        })
      ],
      title: 'Bản đồ nền',
    });

    const baseMapTwo = Basemap.fromId("arcgis-imagery-standard");
    baseMapTwo.title = "Imagery Standard";

    const baseMapThree = Basemap.fromId("osm-standard");
    baseMapThree.title = "Open Street Map";

    const baseMapForur = Basemap.fromId("streets");
    baseMapForur.title = "Street Vector";

    baseMapOne.thumbnailUrl = "./assets/basemap-thumb/ban-do-nen.png";
    baseMapTwo.thumbnailUrl = "./assets/basemap-thumb/imagery-standard.png";
    baseMapThree.thumbnailUrl = "./assets/basemap-thumb/open-street-map.png";

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

    mapServerMLD.allSublayers.forEach((subLayer) => {
      subLayer.createFeatureLayer()
      .then((featureLayer) => {
        switch(featureLayer.layerId) {
          case 0:
            this._fLTramBienAp = featureLayer;
            break;
          case 1:
            this._fLDuongDayDien = featureLayer;
            break;
          case 2:
            this._fLCotDien = featureLayer;
            break;
          case 3:
            this._fLTranBienApDangVung = featureLayer;
            break;
        }
      });
    });

    const map = new Map({
      basemap: baseMapThree,
    });

    map.add(mapServerMLD);

    const view = new MapView({
      container: container,
      map: map,
      constraints: {
        lods: TileInfo.create().lods,
      },
      scale: scale,
      center: centerPoint,
    });

    const basemapGallery = new BasemapGallery({ source: [baseMapOne, baseMapTwo, baseMapThree, baseMapForur], view });

    const bgExpand = new Expand({
      view,
      content: basemapGallery,
      expandIconClass: "esri-icon-basemap",
      expandTooltip: "Thay đổi bản đồ nền",
      autoCollapse: true,
    });

    view.ui.add(bgExpand, "bottom-left");

    view.watch("spatialReference", ()=> {
      console.log(view.spatialReference.wkid);
    });

    this._view = view;

    return this._view.when();
  }

  ngOnInit(): void {
    const serverInfo = new ServerInfo(environment.serverInfo);
    const userInfo = environment.userInfo;
    from(esriId.generateToken(serverInfo, userInfo)).subscribe((result) => {
      from(this.initializeMap(result.token)).subscribe(() => {
        console.log('The map is ready.');
        // console.log(this._fLCotDien.get<any>('parsedUrl').path);
        // console.log(this._fLDuongDayDien.get<any>('parsedUrl').path);
        // console.log(this._fLTramBienAp.get<any>('parsedUrl').path);
        // console.log(this._fLTranBienApDangVung.get<any>('parsedUrl').path);

        this._view.on("pointer-move", (event) => {
          this.changeMouseCursor('default');
          this._view.graphics.removeAll();
        });
        const subject = new Subject<any>();
        subject.pipe(
          debounceTime(100),
          switchMap(result => {
            return this.highLight(result);
          })
        ).subscribe(response => {
          let results = response.results;
          // console.log(results);
          if(results.length !== 0) {
            for(let i = 0; i < results.length; i++) {
              if(results[i].layerId == 2) {
                this.changeMouseCursor('pointer');
                const feature = results[i].feature;
                const _highlightPoint = new SimpleMarkerSymbol({
                  size: '15px',
                  outline: {
                    color: [124, 252 , 0],
                    width: 2,
                  },
                });
                this._view.graphics.removeAll();
                feature.symbol = _highlightPoint;
                this._view.graphics.add(feature);
              }
            }
          } else {
            this.changeMouseCursor('default');
            this._view.graphics.removeAll();
          }
        });

        this._view.on("pointer-move", (event) => {
          subject.next(event);
        });
      });
    });
  }

  private changeMouseCursor(cursor: string) {
    this.mapViewEl.nativeElement.style.cursor = cursor;
  }

  private highLight(event: any): Observable<any> {
    let params = new IdentifyParameters();
    params.tolerance = 5;
    params.layerIds = [0, 1, 2, 3];
    params.layerOption = "visible";
    params.width = this._view.width;
    params.height = this._view.height;
    params.geometry = this._view.toMap(event);
    params.mapExtent = this._view.extent;
    params.returnGeometry = true;
    return from(identify.identify(environment.mapUrl.mapServerMLDUrl, params));
  }

  ngOnDestroy(): void {
    if (this._view) {
      this._view.destroy();
    }
  }
}
