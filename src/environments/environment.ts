// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapUrl: {
    baseMapUrl:
      'https://gis.npt.com.vn/server/rest/services/Hosted/VietNam_Basemap_20220516/VectorTileServer',
    mapServerMLDUrl:
      'https://gis.npt.com.vn/server/rest/services/MangLuoiTTD/MapServer',
    mapServerPhimAnhUrl:
      'https://gis.npt.com.vn/server/rest/services/MangLuoiDien/PhimAnh/MapServer',
  },
  userInfo: {
    username: 'portal',
    password: 'EVNNPT.2022!',
  },
  serverInfo: {
    server: 'https://gis.npt.com.vn/server/rest/services',
    tokenServiceUrl: 'https://gis.npt.com.vn/portal/sharing/rest/generateToken',
    shortLivedTokenValidity: 30,
  },
  centerPoint: {
    x: 11694761.714454936,
    y: 1028934.7847140391,
    spatialReference: { wkid: 102100 },
  },
  scale: 30000,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
