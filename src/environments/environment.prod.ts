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
    password: '!EVNNPT2022!',
  },
  serverInfo: {
    server: 'https://gis.npt.com.vn/server/rest/services',
    tokenServiceUrl:
      'https://gis.npt.com.vn/portal/sharing/rest/generateToken',
    shortLivedTokenValidity: 30,
  },
  centerPoint: {
    x: 11694719.833312226,
    y: 1028930.1145095925,
    spatialReference: { wkid: 102100 },
  },
  scale: 30000,
};
