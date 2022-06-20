// Highlighted county polygons
export const highlightLayer = {
  id: 'counties-highlighted',
  type: 'fill',
  source: 'counties',
  'source-layer': 'original',
  paint: {
    'fill-outline-color': '#484896',
    'fill-color': '#6e599f',
    'fill-opacity': 0.75
  }
};

export const layerStyle = {
  id: 'point',
  type: 'line',
  paint: {
    'line-width': 0.5,
    'line-color': '#FFFFFF',
  }
};

export const areaStyle = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'type',
      stops: [
        [1, '#FFFFFF'],
        [2, '#abdda4'],
        [3, '#FFFFFF'],
        [4, '#FFFbbb'],
        [5, '#FFFFFF'],
      ]
    },
    "fill-opacity": {
      property: 'type',
      stops: [
        [1, 0.5],
        [2, 0.4],
        [3, 0.5],
        [4, 0.5],
        [5, 1],
      ]
    }
  }
}

export const captureStyle = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'type',
      stops: [
        [2, '#00e7ff'],
      ]
    },
    "fill-opacity": {
      property: 'type',
      stops: [
        [2, 0.8],
      ]
    }
  }
}