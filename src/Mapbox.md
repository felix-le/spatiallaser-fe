import React, { useEffect, useMemo, useState, useRef } from "react";

import Map, { Source, Layer, LayerProps } from "react-map-gl";
import {
clusterLayer,
clusterCountLayer,
unclusteredPointLayer,
unclusteredLabelLayer,
} from "./layers";

export const dataLayer: LayerProps = {
id: "data",
type: "fill",
paint: {
"fill-color": "#0080ff", // blue color fill
"fill-opacity": 0.5,
},
};

export const dataLayer1: LayerProps = {
id: "clusters",
type: "circle",
source: "locations",
filter: ["has", "point_count"],
paint: {
"circle-color": [
"step",
["get", "point_count"],
"#F38B00",
100,
"#f1f075",
750,
"#f28cb1",
],
"circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
},
};

const onClick = (event: any) => {
// const feature = event;
// console.log('🚀 ~ file: Mapbox.js:27 ~ onClick ~ event', event);
// const mapboxSource = mapRef.current.getSource('locations');
// mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
// if (err) {
// return;
// }
// mapRef.current.easeTo({
// center: feature?.geometry.coordinates,
// zoom,
// duration: 500,
// });
// });
};

const Mapbox = () => {
const [allData, setAllData] = useState<any>(null);
const mapRef = useRef(null);
useEffect(() => {
/_ global fetch _/
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
mapStyle="mapbox://styles/mapbox/dark-v9"
mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
interactiveLayerIds={[clusterLayer.id]}
style={{ width: "100%", height: 1000 }}
onClick={(event) => onClick(event)}
ref={mapRef}
cursor="pointer" >
<Source
type="geojson"
data={data as any}
id="locations"
cluster={false}
clusterMaxZoom={14}
clusterRadius={50} >
<Layer {...clusterLayer} />
<Layer {...clusterCountLayer} />
<Layer {...unclusteredPointLayer} />
<Layer {...unclusteredLabelLayer} />
</Source>
</Map>
);
};

export default Mapbox;
