import Mapbox from './Mapbox2'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const App: React.FC = () => {
  return (
    <>
      <h1 className='text-3xl font-bold underline'>Hello world!</h1>
      {/* <MapComponent spatialObjectString={EXAMPLE_DATA[0]?.spatialobj} /> */}
      <Mapbox />
    </>
  )
}

export default App
