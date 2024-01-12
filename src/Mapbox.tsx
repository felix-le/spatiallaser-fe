import React, { useEffect, useMemo, useState } from "react";

import Map, { Source, Layer, LayerProps, Marker } from "react-map-gl";
import Pin from "./pin.png";
import "mapbox-gl/dist/mapbox-gl.css";
export const dataLayer: LayerProps = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": "#0080ff", // blue color fill
    "fill-opacity": 0.5,
  },
};

export const dataLayer1: LayerProps = {
  id: "outline",
  type: "line",
  paint: {
    "line-color": "#000",
    "line-width": 3,
  },
};

const Mapbox = () => {
  const [allData, setAllData] = useState<any>(null);
  // 33.19790511065013, -96.63958405272592
  useEffect(() => {
    /* global fetch */
    fetch("http://localhost:5555")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err)); // eslint-disable-line
  }, []);

  const data = useMemo(() => {
    if (!allData) return {};
    const geojson = {
      type: "FeatureCollection",
      features: allData.map((item: { spatialobj: string }) => ({
        type: "Feature",
        geometry: JSON.parse(item?.spatialobj),
      })),
    };

    return geojson;
  }, [allData]);

  return (
    <Map
      initialViewState={{
        latitude: 33.19790511065013,
        longitude: -96.63958405272592,
        zoom: 10,
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
      interactiveLayerIds={["data"]}
      style={{ width: "100%", height: 1400 }}
    >
      <Source type="geojson" data={data as any}>
        <Layer {...dataLayer} />
      </Source>
      <Marker
        longitude={-96.63958405272592}
        latitude={33.19790511065013}
        // pitchAlignment="map"
        // anchor="center"
      >
        <img src={Pin} height={10} width={10} />
      </Marker>
    </Map>
  );
};

export default Mapbox;
