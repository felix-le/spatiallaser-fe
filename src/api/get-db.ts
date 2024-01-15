import { get } from './baseApi';

// router.get("/map", getMapData);
// router.get("/area-centroid-inside", getAreaCentroidInside);
// router.get("/area-inside-circle", getAreaInsideCircle);

export async function getMapApi() {
  return get(`/map`);
}

export async function getAreaCentroidInsideCircle(lng: number, lat: number, radius: number) {
  return get(`/area-centroid-inside?lng=${lng}&lat=${lat}&radius=${radius}`);
}

export async function getAreaInsideCircle(lng: number, lat: number, radius: number) {
  return get(`/area-inside-circle?lng=${lng}&lat=${lat}&radius=${radius}`);
}

export async function getAreaCircle(lng: number, lat: number, radius: number) {
  return get(`/circle?lng=${lng}&lat=${lat}&radius=${radius}`);
}
