interface ISpatialObject {
  income: number;
  population: number;
  centroid: string;
  geometry: string;
}

interface IDataPoint {
  income: number;
  population: number;
  centroid: string;
  geometry: string;
}

interface IMapDataContext {
  dataMap: IDataPoint[];
  fetchCentroid: (lng: number, lat: number, radius: number) => void;
  fetchInsideCircle: (lng: number, lat: number, radius: number) => void;
}

export type { ISpatialObject, IDataPoint, IMapDataContext };
