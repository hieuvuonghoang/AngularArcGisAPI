// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapUrl: {
    baseMapUrl:
      'https://evnnpt.ftiglobal.com.vn/arcgis/rest/services/Hosted/VNBaseMap_2000/VectorTileServer',
    layerPhimAnhUrl:
      // 'https://evnnpt.ftiglobal.com.vn/arcgis/rest/services/MangLuoiDien/PhimAnh/FeatureServer',
      'https://evnnpt.ftiglobal.com.vn/arcgis/rest/services/Administrative/PhimAnh/FeatureServer',
  },
  userInfo: {
    username: 'hvquang',
    password: '123454321Aa@',
  },
  serverInfo: {
    server: 'https://evnnpt.ftiglobal.com.vn/arcgis/rest/services',
    tokenServiceUrl:
      'https://evnnpt.ftiglobal.com.vn/arcgis/sharing/rest/generateToken',
    shortLivedTokenValidity: 30,
  },
  centerPoint: {
    x: 685509.468,
    y: 1790410.454,
    spatialReference: { wkid: 3405 },
  },
  scale: 10000000,
  layerId: {
    layerBaseMapId: '1',
    layerPhimAnhId: '2',
  },
  apiUrl: 'https://localhost:44363/api',
  jwtToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMTZlNTNkLThmMGEtNDJkOC1hODM0LWI3YTY4NWFhMmM5MCIsInRlbnRrIjoidGVzdDAxIiwibmJmIjoxNjQxMTc3MTM5LCJleHAiOjE2NDExODA3MzksImlhdCI6MTY0MTE3NzEzOX0.xkn1OkPviN2PldTxo2pV4Kwzj2XluUFpnuqGe2JzQQ0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
