import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalPhimAnhComponent } from './map-modal/modal-phim-anh/modal-phim-anh.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './_helpers/jwt-interceptor.service';

@NgModule({
  declarations: [AppComponent, ModalPhimAnhComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
  ],
=======
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MapViewComponent } from './map/map-view/map-view.component';
import { PhimAnhPopupComponent } from './map/map-popup/phim-anh-popup/phim-anh-popup.component';

@NgModule({
  declarations: [AppComponent, MapViewComponent, PhimAnhPopupComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
>>>>>>> 582460cc42b03e0e4e86685ea1fd0b3a07ed4354
  bootstrap: [AppComponent],
})
export class AppModule {}
