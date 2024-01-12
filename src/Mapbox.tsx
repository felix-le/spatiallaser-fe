import React, { useEffect, useMemo, useState } from "react";

import Map, { Source, Layer, LayerProps } from "react-map-gl";

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

    console.log({ geojson });

    return geojson;
  }, [allData]);

  return (
    <Map
      initialViewState={{
        latitude: 33.3689369320978,
        longitude: -96.4426961542357,
        zoom: 10,
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
      interactiveLayerIds={["data"]}
      style={{ width: 1000, height: 1000 }}
    >
      <Source type="geojson" data={data as any}>
        <Layer {...dataLayer} />
      </Source>
    </Map>
  );
};

export default Mapbox;
