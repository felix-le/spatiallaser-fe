import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Map, { Layer, Marker, ScaleControl, Source } from 'react-map-gl';
import Pin from '../../images/pin.png';
// Components
import { dataLayerHighLight, dataLayer } from './Elements/layers';
import { MapContext } from './MapWithContext';
import { ISpatialObject } from './interfaces';
import Results from './Elements/Results';

const defaultMarker = {
  longitude: -96.63958405272592,
  latitude: 33.19790511065013
};
export function modifyArray(array: ISpatialObject[]): void {
  for (const item of array) {
    const coordinates = item.centroid
      .replace(/POINT|\(|\)/g, '')
      .split(' ')
      .map(parseFloat);

    item.centroid = JSON.stringify({
      type: 'Point',
      coordinates: JSON.stringify(coordinates)
    });
  }
}

const Mapbox: React.FC = () => {
  const { dataMap, fetchInsideCircle, fetchCircle, fetchCentroid } = useContext(MapContext);
  const [highlight, setHighlight] = useState<ISpatialObject[]>([]);
  const [circle, setCircle] = useState<any>(null);
  const mapRef = useRef(null);
  const [isProportionMethod, setIsProportionMethod] = useState<boolean>(true);

  const radius = 10;

  const data = useMemo(() => {
    try {
      if (!dataMap) return null;

      const geojson = {
        type: 'FeatureCollection',
        features: dataMap.map((item: { geometry: string }) => ({
          type: 'Feature',
          geometry: JSON.parse(item.geometry)
        }))
      };
      return geojson;
    } catch (error) {
      console.error('Error parsing spatialobj:', error);
      return null;
    }
  }, [dataMap]);

  const getHighLight = async (lng: number, lat: number) => {
    if (isProportionMethod) {
      const { data } = await fetchInsideCircle(lng, lat, radius / 100);
      setHighlight(data);
      return;
    }
    if (!isProportionMethod) {
      const { data } = await fetchCentroid(lng, lat, radius / 100);
      setHighlight(data);
    }
  };

  const getCircle = async (lng: number, lat: number) => {
    const { data } = await fetchCircle(lng, lat, radius / 100);

    setCircle(data);
  };

  useEffect(() => {
    getHighLight(defaultMarker.longitude, defaultMarker.latitude);
    getCircle(defaultMarker.longitude, defaultMarker.latitude);
  }, []);

  const handleMapClick = async (e: any) => {
    getHighLight(e.lngLat.lng, e.lngLat.lat);
    getCircle(e.lngLat.lng, e.lngLat.lat);
  };

  const dataHighlight = useMemo(() => {
    try {
      if (!highlight) return null;

      const geojson = {
        type: 'FeatureCollection',
        features: highlight.map((item: { geometry: string }) => ({
          type: 'Feature',
          geometry: JSON.parse(item.geometry)
        }))
      };
      return geojson;
    } catch (error) {
      console.error('Error parsing spatialobj:', error);
      return null;
    }
  }, [highlight]);

  const dataCircle = useMemo(() => {
    try {
      if (!circle) return null;
      const geojson = {
        geometry: JSON.parse(circle?.[0]?.circle),
        type: 'Feature'
      };
      return geojson;
    } catch (error) {
      console.error('Error parsing spatialobj:', error);
      return null;
    }
  }, [circle]);

  const displayData = dataMap?.map((item: any) => {
    const match = item.centroid.match(/-?\d+(\.\d+)? -?\d+(\.\d+)?/);
    if (match) {
      const [longitude, latitude] = match[0].split(' ').map(parseFloat);
      const newObj = {
        ...item,
        centroid: {
          longitude,
          latitude
        }
      };
      return newObj;
    }
  });
  console.log(highlight);
  return (
    <>
      <Map
        initialViewState={{
          latitude: defaultMarker.latitude,
          longitude: defaultMarker.longitude,
          zoom: 10
        }}
        ref={mapRef}
        mapStyle='mapbox://styles/mapbox/light-v9'
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
        interactiveLayerIds={['data']}
        style={{ width: '100%', height: 1400 }}
        // remove the preventStyleDiffing prop
        styleDiffing={false}
        onClick={(e) => handleMapClick(e)}
      >
        <Source
          type='geojson'
          // show up area of data
          data={data as any}
        >
          <div style={{ position: 'absolute', bottom: 200, left: 100 }}>
            <ScaleControl
              maxWidth={100}
              unit={'metric'}
            />
          </div>

          {/* Centroid */}
          {displayData?.map((item: any) => {
            return (
              <Marker
                key={item.centroid.longitude}
                longitude={item.centroid.longitude}
                // latitude={JSON.parse(item?.centroid)?.coordinates?.[1]}
                latitude={item.centroid.latitude}
              >
                <img
                  src={Pin}
                  height={10}
                  width={10}
                  alt='marker'
                />
              </Marker>
            );
          })}
          <Source
            id='my-data'
            type='geojson'
            data={dataCircle as any}
          >
            <Layer
              id='point-90-hi'
              type='line'
            />
          </Source>
        </Source>

        {isProportionMethod && (
          <Source
            id='my-data2'
            type='geojson'
            data={dataCircle as any}
          >
            <Layer
              type='fill'
              paint={{
                'fill-color': 'yellow',
                'fill-opacity': 0.8
              }}
            />
          </Source>
        )}
        {!isProportionMethod && (
          <Source
            id='my-dat3'
            type='geojson'
            // show up area of data
            data={dataHighlight as any}
          >
            <Layer {...(dataLayerHighLight as any)} />
          </Source>
        )}
      </Map>
      <div className='container'>
        <Results
          isProportionMethod={isProportionMethod}
          setIsProportionMethod={setIsProportionMethod}
          data={highlight}
        />
      </div>
    </>
  );
};

export default Mapbox;
