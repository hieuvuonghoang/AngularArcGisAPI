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
import LayerList from '@arcgis/core/widgets/LayerList';
import Graphic from '@arcgis/core/Graphic';
import Basemap from '@arcgis/core/Basemap';
import esriConfig from '@arcgis/core/config.js';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopupPhimAnh, ScreenCordinate } from 'src/app/model';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements OnInit, OnDestroy {
  private view!: MapView;
  //PhimAnh
  private fLPhimAnh!: FeatureLayer;
  private fLViewPhimAnh!: __esri.FeatureLayerView;
  private fLPhimAnhHighLight: __esri.Handle | null = null;
  private iDFLPhimAnhHighLight!: number;
  //DuongDay
  private fLDuongDay!: FeatureLayer;
  private fLViewDuongDay!: __esri.FeatureLayerView;
  private fLDuongDayHighLight: __esri.Handle | null = null;
  private iDFLDuongDayHighLight!: number;
  //CotDien
  private fLCotDien!: FeatureLayer;
  private fLViewCotDien!: __esri.FeatureLayerView;
  private fLCotDienHighLight: __esri.Handle | null = null;
  private iDFLCotDienHighLight!: number;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  @Output() private onClickPhimAnhEvent = new EventEmitter<boolean>();
  @Output() private onHoverPhimAnhEvent = new EventEmitter<PopupPhimAnh>();

  constructor() {}

  private initializeMap(token: string): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    const scale = environment.scale;
    const centerPoint = new Point(environment.centerPoint);
    const baseMapUrl = environment.mapUrl.baseMapUrl;
    const layerPhimAnhUrl = environment.mapUrl.layerPhimAnhUrl;
    const layerDuongDayUrl = environment.mapUrl.layerDuongDayUrl;
    const layerCotDienUrl = environment.mapUrl.layerCotDienUrl;
    const serviceUrls = [
      baseMapUrl,
      layerPhimAnhUrl,
      layerDuongDayUrl,
      layerCotDienUrl,
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

    this.fLPhimAnh = new FeatureLayer({
      url: layerPhimAnhUrl,
    });

    this.fLDuongDay = new FeatureLayer({
      url: layerDuongDayUrl,
    });

    this.fLCotDien = new FeatureLayer({
      url: layerCotDienUrl,
    });

    const map = new Map({
      basemap: basemap,
      layers: [this.fLDuongDay, this.fLCotDien, this.fLPhimAnh],
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

    view.whenLayerView(this.fLPhimAnh).then((layerView) => {
      this.fLViewPhimAnh = layerView;
    });

    view.whenLayerView(this.fLDuongDay).then((layerView) => {
      this.fLViewDuongDay = layerView;
    });

    view.whenLayerView(this.fLCotDien).then((layerView) => {
      this.fLViewCotDien = layerView;
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

  ngOnInit(): void {
    const serverInfo = new ServerInfo(environment.serverInfo);
    const userInfo = environment.userInfo;
    from(esriId.generateToken(serverInfo, userInfo)).subscribe((result) => {
      from(this.initializeMap(result.token)).subscribe(() => {
        console.log('The map is ready.');
        this.view.on('pointer-move', (event) => {
          this.highLightPhimAnh(event);
          this.highLightDuongDay(event);
          this.highLightCotDien(event);
        });
        this.view.on('pointer-down', (event) => {
          this.highLightPhimAnh(event);
          this.highLightDuongDay(event);
          this.highLightCotDien(event);
        });
        this.view.on('click', (event) => {
          this.onClickFLPhimAnh(event);
        });
      });
    });
  }

  private onClickFLPhimAnh(event: any) {
    const opts = {
      include: this.fLPhimAnh,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        const graphic = response.results[0].graphic;
        const attributes = graphic.attributes;
        this.onClickPhimAnhEvent.emit(true);
      } else {
        this.onClickPhimAnhEvent.emit(false);
      }
    });
  }

  private changeMouseCursor(cursor: string) {
    this.mapViewEl.nativeElement.style.cursor = cursor;
  }

  private highLightPhimAnh(event: any) {
    const opts = {
      include: this.fLPhimAnh,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        this.changeMouseCursor('pointer');
        const graphic = response.results[0].graphic;
        const iD = graphic.attributes.OBJECTID;
        this.onHoverPhimAnhEvent.emit(
          new PopupPhimAnh({
            screenCoordinate: new ScreenCordinate({ x: event.x, y: event.y }),
            isShow: true,
            iD: iD,
          })
        );
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
        this.onHoverPhimAnhEvent.emit(
          new PopupPhimAnh({
            screenCoordinate: new ScreenCordinate({ x: event.x, y: event.y }),
            isShow: false,
          })
        );
        if (this.fLPhimAnhHighLight) {
          this.fLPhimAnhHighLight.remove();
          this.fLPhimAnhHighLight = null;
        }
      }
    });
  }

  private highLightDuongDay(event: any) {
    const opts = {
      include: this.fLDuongDay,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        this.changeMouseCursor('pointer');
        const graphic = response.results[0].graphic;
        const iD = graphic.attributes.OBJECTID;

        if (this.fLDuongDayHighLight && this.iDFLDuongDayHighLight !== iD) {
          this.fLDuongDayHighLight.remove();
          this.fLDuongDayHighLight = null;
          return;
        }
        if (this.fLDuongDayHighLight) {
          return;
        }
        this.fLDuongDayHighLight = this.fLViewDuongDay.highlight(iD);
        this.iDFLDuongDayHighLight = iD;
      } else {
        this.changeMouseCursor('default');
        if (this.fLDuongDayHighLight) {
          this.fLDuongDayHighLight.remove();
          this.fLDuongDayHighLight = null;
        }
      }
    });
  }

  private highLightCotDien(event: any) {
    const opts = {
      include: this.fLCotDien,
    };
    this.view.hitTest(event, opts).then((response) => {
      // check if a feature is returned from the hurricanesLayer
      if (response.results.length) {
        this.changeMouseCursor('pointer');
        const graphic = response.results[0].graphic;
        const iD = graphic.attributes.OBJECTID;
        // console.log('CotDienID: ' + iD);
        if (this.fLCotDienHighLight && this.iDFLCotDienHighLight !== iD) {
          this.fLCotDienHighLight.remove();
          this.fLCotDienHighLight = null;
          return;
        }
        if (this.fLCotDienHighLight) {
          return;
        }
        this.fLCotDienHighLight = this.fLViewCotDien.highlight(iD);
        this.iDFLCotDienHighLight = iD;
      } else {
        this.changeMouseCursor('default');
        if (this.fLCotDienHighLight) {
          this.fLCotDienHighLight.remove();
          this.fLCotDienHighLight = null;
        }
      }
    });
  }

  onZoom() {
    //CotDienID: 8481;
    this.fLCotDien.definitionExpression = 'OBJECTID = 8481';
    this.fLCotDien.queryExtent().then((response) => {
      this.view.goTo(response.extent).catch((error) => {
        console.error(error);
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
