import React, { useEffect, useMemo, useState } from "react";
import Map, { Source, Layer, LayerProps, Marker } from "react-map-gl";
import Pin from "./pin.png";
import "mapbox-gl/dist/mapbox-gl.css";

interface SpatialObject {
  spatialobj: string;
}

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

const defaultMarker = {
  longitude: -96.63958405272592,
  latitude: 33.19790511065013,
};

const Mapbox: React.FC = () => {
  const [allData, setAllData] = useState<SpatialObject[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:5555")
      .then((resp) => {
        const contentType = resp.headers.get("content-type");
        if (contentType && contentType.includes("json")) {
          return resp.json() as Promise<SpatialObject[]>;
        } else {
          throw new Error("Response is not in JSON format");
        }
      })
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const data = useMemo(() => {
    try {
      if (!allData) return null;

      const geojson = {
        type: "FeatureCollection",
        features: allData.map((item) => ({
          type: "Feature",
          geometry: JSON.parse(item.spatialobj),
          properties: {}, // Add properties based on your data structure
        })),
      };
      return geojson;
    } catch (error) {
      console.error("Error parsing spatialobj:", error);
      return null;
    }
  }, [allData]);

  const handleMapClick = (e: any) => {
    console.log(e.lngLat);
    // setMarker({lng, lat});
  };

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
      onClick={(e) => handleMapClick(e)}
    >
      <Source type="geojson" data={data as any}>
        <Layer {...dataLayer} />
        <Marker
          longitude={defaultMarker.longitude}
          latitude={defaultMarker.latitude}
        >
          <img src={Pin} height={10} width={10} alt="marker" />
        </Marker>
      </Source>
    </Map>
  );
};

export default Mapbox;
