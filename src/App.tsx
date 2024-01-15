import Mapbox from './components/map-circle';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const App: React.FC = () => {
  return (
    <>
      <Mapbox />
    </>
  );
};

export default App;
