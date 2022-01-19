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
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalPhimAnhComponent } from './map-modal/modal-phim-anh/modal-phim-anh.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AppComponent implements OnInit {
  title = 'AngularArcGisAPI';
<<<<<<< HEAD
  public view!: MapView;
  private fLPhimAnh!: FeatureLayer;
  private dangMoModalPhimAnh: boolean = false;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    // config.backdrop = 'static';
    config.size = 'xl';
    config.scrollable = true;
  }

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

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
          id: environment.layerId.layerBaseMapId,
        }),
      ],
      title: 'Bản đồ nền',
    });

    const layerPhimAnh = new FeatureLayer({
      url: environment.mapUrl.layerPhimAnhUrl,
      id: environment.layerId.layerPhimAnhId,
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
    });

    view.whenLayerView(layerPhimAnh).then((layerView: any) => {
      this.fLPhimAnh = layerView.layer;
    });

    this.view = view;

    return this.view.when();
  }

  ngOnInit(): any {
    const serverInfo = new ServerInfo(environment.serverInfo);
    const userInfo = environment.userInfo;
    from(esriId.generateToken(serverInfo, userInfo)).subscribe((result) => {
      console.log(result);
      from(this.initializeMap(result.token)).subscribe(() => {
        console.log('The map is ready.');
        this.mapEventHandler();
      });
    });
  }

  mapEventHandler() {
    this.view.on('click', (event) => {
      this.hitTestLayerPhimAnhClick(event);
    });
  }

  hitTestLayerPhimAnhClick(event: any) {
    const opts = {
      include: this.fLPhimAnh,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the fLPhimAnh
      if (response.results.length) {
        const graphic = response.results[0].graphic;
        const attributes = graphic.attributes;
        const queryParams = this.fLPhimAnh.createQuery();
        console.log(`OBJECTID = ${attributes['OBJECTID']}`);
        queryParams.where = `OBJECTID = ${attributes['OBJECTID']}`;
        queryParams.outFields = ['MA_DTQS'];
        this.fLPhimAnh.queryFeatures(queryParams).then((results) => {
          // prints the array of result graphics to the console
          console.log(results.features[0].attributes['MA_DTQS']);
          const maDTQS = results.features[0].attributes['MA_DTQS'];
          this.openModalPhimAnh(event, maDTQS);
        });
        // do something with the graphic
      }
    });
  }

  openModalPhimAnh(event: any, maDTQS: string) {
    let modalRef = this.modalService.open(ModalPhimAnhComponent);
    modalRef.componentInstance.event = event;
    modalRef.componentInstance.maDTQS = maDTQS;
  }

  addFeature(event: any) {
    const point = event.mapPoint.clone();
    console.log(point);
    const attributes = {
      MA_DTQS: 'ABD',
      THIETBICHUP: 'test',
    };
    const addFeature = new Graphic({
      geometry: point,
      attributes: attributes,
    });
    this.fLPhimAnh
      .applyEdits({
        addFeatures: [addFeature],
      })
      .then((result) => {
        console.log(result);
        this.fLPhimAnh.refresh();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  deleteFeature() {
    // const deleteFeatures = [{ objectId: 467 }, { objectId: 500 }];
    let deleteFeatures: { objectId: any }[] = [];
    const queryParams = this.fLPhimAnh.createQuery();
    queryParams.where = `OBJECTID <> 1`;
    this.fLPhimAnh.queryFeatures(queryParams).then((results) => {
      for (let index = 0; index < results.features.length; index++) {
        deleteFeatures.push({
          objectId: results.features[index].attributes['OBJECTID'],
        });
        // console.log(results.features[index].attributes['MA_DTQS']);
      }
      this.fLPhimAnh
        .applyEdits({
          deleteFeatures: deleteFeatures,
        })
        .then((result) => {
          console.log(result);
        });
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
=======
  openedSlideBar = false;
  openedSlideBarPhimAnh = false;
  showPopupPhimAnh = false;

  ngOnInit(): any {}

  openSlideBarPhimAnh(event: any) {
    if (event && !this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = true;
    } else if (!event && this.openedSlideBarPhimAnh) {
      this.openedSlideBarPhimAnh = false;
>>>>>>> 582460cc42b03e0e4e86685ea1fd0b3a07ed4354
    }
  }
}
