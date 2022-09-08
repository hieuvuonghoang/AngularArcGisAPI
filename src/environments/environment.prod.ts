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
