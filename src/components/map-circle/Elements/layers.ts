interface LayerProps {
  id: string;
  type: string;
  paint: {
    'fill-color'?: string;
    'fill-opacity'?: number;
    'line-color'?: string;
    'line-width'?: number;
  };
}

export const dataLayer: LayerProps = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': '#0080ff', // blue color fill
    'fill-opacity': 0.5
  }
};

export const dataLayer1: LayerProps = {
  id: 'outline',
  type: 'line',
  paint: {
    'line-color': '#000',
    'line-width': 3
  }
};
