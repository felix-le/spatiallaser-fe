import React, { useEffect } from "react";
import mapboxgl, { GeoJSONSourceRaw } from "mapbox-gl";
import { EXAMPLE_DATA } from "./data";

interface SpatialObject {
  type: string;
  geometry: any; // Adjust the type based on your GeoJSON structure
  properties: any; // Adjust the type based on your GeoJSON structure
}

interface MapComponentProps {
  spatialObjectString: any;
}

const defaultCenter = [43.74732703009964, -79.4933479860804];

const MapComponent: React.FC<MapComponentProps> = ({ spatialObjectString }) => {
  useEffect(() => {
    // Access Mapbox access token from environment variables
    const mapboxAccessToken =
      process.env.REACT_APP_MAPBOX_TOKEN || "YOUR_DEFAULT_MAPBOX_TOKEN";

    if (!mapboxAccessToken) {
      console.error(
        "Mapbox access token is missing. Make sure to set REACT_APP_MAPBOX_TOKEN in your environment variables."
      );
      return;
    }

    mapboxgl.accessToken = mapboxAccessToken;

    const map = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74, 38],
      zoom: 5,
    });

    // Check for truthy spatialObjectString before parsing
    const spatialObjString = spatialObjectString || EXAMPLE_DATA[0]?.spatialobj;

    if (!spatialObjString) {
      console.error(
        "Spatial object string is missing. Make sure to provide a valid spatial object string."
      );
      return;
    }

    try {
      const spatialObj: SpatialObject = JSON.parse(spatialObjString);

      // Check for a valid GeoJSON structure before adding to the map
      if (spatialObj.type !== "FeatureCollection") {
        console.error(
          "Invalid GeoJSON structure. The spatial object should be a FeatureCollection."
        );
        return;
      }

      addSpatialObjectToMap(map, spatialObj);
    } catch (error) {
      console.error("Error parsing spatial object string:", error);
    }

    return () => {
      map.remove(); // Cleanup map instance when the component unmounts
    };
  }, [spatialObjectString]);

  const addSpatialObjectToMap = (
    map: mapboxgl.Map,
    spatialObj: SpatialObject
  ) => {
    map.addSource("spatial-object", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: spatialObj.geometry,
        properties: {},
        // coordinates: [0, 0], // Replace with the desired coordinates
      },
    });

    map.addLayer({
      id: "spatial-object",
      type: "fill", // Use 'circle' instead of 'fill' for points
      source: "spatial-object" as unknown as GeoJSONSourceRaw,
      paint: {
        "fill-color": "red",
        "fill-opacity": 1, // Set the opacity of the fill
        "fill-outline-color": "red", // Set the outline color of the fill
        "fill-translate": [15, 15], // Adjust the translation to make the filled area larger
      },
    });
  };

  return (
    <div id="map-container" style={{ width: "100%", height: "1000px" }}></div>
  );
};

export default MapComponent;
