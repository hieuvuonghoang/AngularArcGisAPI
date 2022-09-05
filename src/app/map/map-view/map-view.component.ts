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
import Basemap from '@arcgis/core/Basemap';
import esriConfig from '@arcgis/core/config.js';
import { debounceTime, from, Observable, Subject, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import IdentifyParameters from '@arcgis/core/rest/support/IdentifyParameters';
import * as identify from '@arcgis/core/rest/identify';
import Expand from '@arcgis/core/widgets/Expand';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import IdentifyResult from '@arcgis/core/tasks/support/IdentifyResult';
import Graphic from '@arcgis/core/Graphic';
import Locate from '@arcgis/core/widgets/Locate';
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

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
    const mapServerPhimAnhUrl = environment.mapUrl.mapServerPhimAnhUrl;
    const serviceUrls = [baseMapUrl, mapServerMLDUrl, mapServerPhimAnhUrl];

    //#region  "esriConfig"
    esriConfig.assetsPath = './assets';

    esriConfig.apiKey =
      'AAPKce6c0d7d41324b7498260898e4d28dc5QHG_Ioa_24tLd-SvgR914a7rGUOOciRlTgbojWFzNxZ3yVHl_CHJWzbf4XhoXxF5';

    serviceUrls.forEach((element) => {
      esriConfig.request.interceptors?.push({
        urls: element,
        before: (params) => {
          // console.log(params);
          this.changeMouseCursor('progress');
          params.requestOptions.query = params.requestOptions.query || {};
          params.requestOptions.query.token = token;
        },
        after: (response) => {
          this.changeMouseCursor('default');
          // console.log(response);
        },
      });
    });
    //#endregion

    const baseMapOne = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: baseMapUrl,
        }),
      ],
      title: 'Bản đồ nền',
    });

    const baseMapTwo = Basemap.fromId('arcgis-imagery-standard');
    baseMapTwo.title = 'Imagery Standard';

    const baseMapThree = Basemap.fromId('osm-standard');
    baseMapThree.title = 'Open Street Map';

    const baseMapForur = Basemap.fromId('streets');
    baseMapForur.title = 'Street Vector';

    baseMapOne.thumbnailUrl = './assets/basemap-thumb/ban-do-nen.png';
    baseMapTwo.thumbnailUrl = './assets/basemap-thumb/imagery-standard.png';
    baseMapThree.thumbnailUrl = './assets/basemap-thumb/open-street-map.png';

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

    const mapServerPhimAnh = new MapImageLayer({
      url: mapServerPhimAnhUrl,
      title: 'Phim ảnh',
      sublayers: [
        {
          id: 0,
          title: 'Phim ảnh'
        }
      ]
    })

    mapServerMLD.allSublayers.forEach((subLayer) => {
      subLayer.createFeatureLayer().then((featureLayer) => {
        switch (featureLayer.layerId) {
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
    map.add(mapServerPhimAnh);

    const view = new MapView({
      container: container,
      map: map,
      constraints: {
        lods: TileInfo.create().lods,
      },
      scale: scale,
      center: centerPoint,
    });

    const basemapGallery = new BasemapGallery({
      source: [baseMapOne, baseMapTwo, baseMapThree, baseMapForur],
      view,
    });

    const bgExpand = new Expand({
      view,
      content: basemapGallery,
      expandIconClass: 'esri-icon-basemap',
      expandTooltip: 'Thay đổi bản đồ nền',
      autoCollapse: true,
    });

    let locateWidget = new Locate({
      view: view,
    });

    view.ui.move('zoom', 'bottom-right');

    view.ui.add([locateWidget], 'bottom-right');

    view.ui.add(bgExpand, 'bottom-left');

    view.watch('spatialReference', () => {
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

        this._view.on('pointer-move', (event) => {
          this.changeMouseCursor('default');
          this._view.graphics.removeAll();
        });

        this._view.on('click', (event) => {
          console.log(event.mapPoint);
          // console.log(this._view.scale);

          // const inSpatialReference = new SpatialReference({
          //   wkid: this._view.spatialReference.wkid //PE_GCS_ED_1950
          // });
          
          // const outSpatialReference = new SpatialReference({
          //   wkid: 3405
          // });

          // projection.load().then(() => {
            
          // })
          
          // const geogtrans = projection.getTransformations(inSpatialReference, outSpatialReference, this._view.extent);
          // let point = event.mapPoint;
          // let a = projection.project(point, outSpatialReference) as __esri.Point;
          // console.log(a);
          // geogtrans.forEach(function(geogtran, index) {
          //   geogtran.steps.forEach(function(step, index) {
          //     console.log(step.wkid);
          //     const outSpatialReferenceStep = new SpatialReference({
          //       wkid: step.wkid
          //     });
          //     point = projection.project(point, outSpatialReferenceStep);
          //     console.log(point);
          //   });
          // });
        });

        // const subject = new Subject<any>();

        // subject
        //   .pipe(
        //     debounceTime(300), //Khi con trỏ chuột di chuyển trên bản đồ, sau khi dừng lại 300ms mới thực hiện query identify
        //     switchMap((result) => {
        //       return this.identifyQuery(result);
        //     }) //switchMap sử dụng để loại bỏ những query identify cũ chưa trả về kết quả khi những query mới được tạo
        //   )
        //   .subscribe((response) => {
        //     let results = response.results as IdentifyResult[];
        //     this.highLight(results);
        //   });

        // this._view.on('pointer-move', (event) => {
        //   subject.next(event);
        // });
      });
    });
  }

  private highLight(identifyResults: IdentifyResult[]) {
    if (identifyResults.length !== 0) {
      this.changeMouseCursor('pointer');
      for (let i = 0; i < identifyResults.length; i++) {
        switch (identifyResults[i].layerId) {
          case 0:
          case 2:
            // console.log(identifyResults[i]);

            const inSpatialReference = new SpatialReference({
              wkid: this._view.spatialReference.wkid //PE_GCS_ED_1950
            });
            
            const outSpatialReference = new SpatialReference({
              wkid: 3405
            });
            
            const geogtrans = projection.getTransformations(inSpatialReference, outSpatialReference, this._view.extent);

            console.log(projection.project(identifyResults[i].feature.geometry, outSpatialReference));

            this.highLightPoint(identifyResults[i]);
            break;
          case 1:
            this.highLightPolyLine(identifyResults[i]);
            break;
          case 3:
            this.highLightPolygon(identifyResults[i]);
            break;
        }
      }
    } else {
      this.changeMouseCursor('default');
      this._view.graphics.removeAll();
    }
  }

  private highLightPoint(identifyResult: IdentifyResult) {
    const markerSymbol = {
      type: 'simple-marker',
      color: [0, 255, 255],
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
    };
    const pointGraphic = new Graphic({
      geometry: identifyResult.feature.geometry,
      symbol: markerSymbol,
    });
    this._view.graphics.add(pointGraphic);
  }

  private highLightPolyLine(identifyResult: IdentifyResult) {
    const lineSymbol = {
      type: 'simple-line', // autocasts as new SimpleLineSymbol()
      color: [0, 255, 255], // RGB color values as an array
      width: 2,
    };
    const polylineGraphic = new Graphic({
      geometry: identifyResult.feature.geometry, // Add the geometry created in step 4
      symbol: lineSymbol, // Add the symbol created in step 5
    });
    this._view.graphics.add(polylineGraphic);
  }

  private highLightPolygon(identifyResult: IdentifyResult) {
    const fillSymbol = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [0, 255, 255, 0.8],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1,
      },
    };
    const polygonGraphic = new Graphic({
      geometry: identifyResult.feature.geometry,
      symbol: fillSymbol,
    });
    this._view.graphics.add(polygonGraphic);
  }

  private changeMouseCursor(cursor: string) {
    this.mapViewEl.nativeElement.style.cursor = cursor;
  }

  private identifyQuery(event: any): Observable<any> {
    let params = new IdentifyParameters();
    params.tolerance = 5;
    params.layerIds = [0, 1, 2, 3];
    params.layerOption = 'visible';
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

  mouseEnter(): void {
    this.btnOp = true;
  }

  mouseLeave(): void {
    this.btnOp = false;
  }

  btnOp: boolean = false;
}
