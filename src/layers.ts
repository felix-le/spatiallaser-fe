interface ClusterLayer {
  id: string;
  type: "circle";
  source: string;
  filter: ["has", string];
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      string,
      number,
      string,
      number,
      string
    ];
    "circle-radius": [
      "step",
      ["get", "point_count"],
      number,
      number,
      number,
      number,
      number
    ];
  };
}

interface ClusterCountLayer {
  id: string;
  type: "symbol";
  source: string;
  filter: ["has", string];
  layout: {
    "text-field": string;
    "text-font": [string, string];
    "text-size": number;
  };
}

interface UnclusteredPointLayer {
  id: string;
  type: "circle";
  source: string;
  filter: ["!", ["has", string]];
  paint: {
    "circle-color": string;
    "circle-radius": number;
    "circle-stroke-width": number;
    "circle-stroke-color": string;
  };
}

interface UnclusteredLabelLayer {
  id: string;
  type: "symbol";
  source: string;
  filter: ["!", ["has", string]];
  layout: {
    "text-font": [string, string];
    "text-size": number;
  };
  paint: {
    "text-color": string;
  };
}

export const clusterLayer: ClusterLayer = {
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

export const clusterCountLayer: ClusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "locations",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer: UnclusteredPointLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "locations",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#F38B00",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

export const unclusteredLabelLayer: UnclusteredLabelLayer = {
  id: "unclustered-label",
  type: "symbol",
  source: "locations",
  filter: ["!", ["has", "point_count"]],
  layout: {
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#F38B00",
  },
};
