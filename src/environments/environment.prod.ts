export const environment = {
  production: true,
  mapUrl: {
    baseMapUrl:
      'https://gis.npt.com.vn/server/rest/services/Hosted/VietNam_Basemap_20220516/VectorTileServer',
    mapServerMLDUrl:
      'https://gis.npt.com.vn/server/rest/services/MangLuoiTTD/MapServer',
    mapServerPhimAnhUrl:
    'https://gis.npt.com.vn/server/rest/services/MangLuoiDien/PhimAnh/MapServer'
  },
  userInfo: {
    username: 'portaladmin',
    password: 'EVN.NPT.2022',
  },
  serverInfo: {
    server: 'https://gis.npt.com.vn/server/rest/services',
    tokenServiceUrl:
      'https://gis.npt.com.vn/portal/sharing/rest/generateToken',
    shortLivedTokenValidity: 30,
  },
  centerPoint: {
    x: 704653.664132111,
    y: 1209061.7257997172,
    spatialReference: { wkid: 3405 },
  },
  scale: 30000,
};
