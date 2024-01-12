import Mapbox from "./Mapbox";
export default function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      {/* <MapComponent spatialObjectString={EXAMPLE_DATA[0]?.spatialobj} /> */}
      <Mapbox />
    </>
  );
}
