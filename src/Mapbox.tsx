import React, { useEffect, useMemo, useState, useRef } from "react";
import Map, {
  Source,
  Layer,
  LayerProps,
  Marker,
  ScaleControl,
} from "react-map-gl";
import Pin from "./pin.png";
import * as turf from "@turf/turf";
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
  const [marker, setMarker] = useState(defaultMarker);
  const mapRef = useRef(null);

  var radius = 5;
  var center = [marker.longitude, marker.latitude];
  var options = {
    steps: 100,
    units: "kilometers" as turf.Units,
    properties: { foo: "bar" },
  };
  var circle = turf.circle(center, radius, options);

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
          properties: {}, // Add properties based on the data structure
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
    if (!e.lngLat) return;
    if (e.lngLat.lng && e.lngLat.lat) {
      setMarker({ longitude: e.lngLat.lng, latitude: e.lngLat.lat });
    }
  };

  return (
    <Map
      initialViewState={{
        latitude: 33.19790511065013,
        longitude: -96.63958405272592,
        zoom: 10,
      }}
      ref={mapRef}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
      interactiveLayerIds={["data"]}
      style={{ width: "100%", height: 1400 }}
      onClick={(e) => handleMapClick(e)}
    >
      <Source type="geojson" data={data as any}>
        <Layer {...dataLayer} />
        <div style={{ position: "absolute", bottom: 200, left: 100 }}>
          <ScaleControl maxWidth={100} unit={"metric"} />
        </div>

        <Source id="my-data" type="geojson" data={circle}>
          <Layer
            id="point-90-hi"
            type="fill"
            paint={{
              "fill-color": "#088",
              "fill-opacity": 0.4,
              "fill-outline-color": "yellow",
            }}
          />
        </Source>
      </Source>
    </Map>
  );
};

export default Mapbox;
