import React, { createContext, useState, useEffect } from 'react';
import { getMapApi, getAreaCentroidInsideCircle, getAreaInsideCircle, getAreaCircle } from '../../api/get-db'; // import the api
import useRequest from '../../hooks/useRequest'; // import the hook
import { IMapDataContext } from './interfaces'; // import the interface
import MapBox from './MapBox';
const initMapContext: IMapDataContext = {
  dataMap: [], // Add the dataMap property
  fetchCentroid: () => {},
  fetchInsideCircle: () => {},
  fetchCircle: () => {}
};

export const MapContext = createContext(initMapContext);

const MapWithContext: React.FC = React.memo(() => {
  const [dataMap, setDataMap] = useState<any[]>([]);
  const fetchCentroid = useRequest({ request: getAreaCentroidInsideCircle });
  const fetchInsideCircle = useRequest({ request: getAreaInsideCircle });

  const fetchCircle = useRequest({ request: getAreaCircle });

  const fetchMapData = useRequest({ request: getMapApi });

  async function fetchMap() {
    try {
      const { data } = await fetchMapData.execute(); // execute is correct here
      setDataMap(data);
    } catch (e) {
      console.log('🚀 ~ fetchMap ~ e', e);
    }
  }

  useEffect(() => {
    fetchMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapValue: IMapDataContext = {
    dataMap,
    fetchCentroid: async (lng: number, lat: number, radius: number) => {
      try {
        const data = await fetchCentroid.execute(lng, lat, radius);
        // handle data as needed
        return data;
      } catch (e) {
        console.log('🚀 ~ fetchCentroid ~ e', e);
      }
    },
    fetchInsideCircle: async (lng: number, lat: number, radius: number) => {
      try {
        const data = await fetchInsideCircle.execute(lng, lat, radius);
        // handle data as needed
        return data;
      } catch (e) {
        console.log('🚀 ~ fetchInsideCircle ~ e', e);
      }
    },
    fetchCircle: async (lng: number, lat: number, radius: number) => {
      try {
        const data = await fetchCircle.execute(lng, lat, radius);
        // handle data as needed
        return data;
      } catch (e) {
        console.log('🚀 ~ fetchCircle ~ e', e);
      }
    }
  };

  return (
    <MapContext.Provider value={mapValue}>
      <MapBox />
    </MapContext.Provider>
  );
});

export default MapWithContext;
