import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

import MeasureControl from '../buttons/measureControl';

export default function Map({bgMap, overlayVisibility}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(27.14983);
    const [lat] = useState(61.61264);
    const [zoom] = useState(12);
  
    useEffect(() => {
      if (map.current) return;
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
            version: 8,
            sources: {
                mapantTiles: {
                    type: 'raster',
                    tiles: ['https://wmts.mapant.fi/wmts_EPSG3857.php?z={z}&y={y}&x={x}'],
                    tileSize: 256,
                    attribution: 'MapAnt',
                },
                gSatTiles: {
                  type: 'raster',
                  tiles: ['https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'],
                  tileSize: 256,
                },
                oldMapTiles: {
                    type: 'raster',
                    tiles: ['./tiles/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: 'Jukola 2025',
                    maxzoom: 16,
                    minzoom: 10,
                    bounds: [27+8/60+2.79/3600, 61+37/60+12.37/3600, 27+10/60+45.88/3600, 61+38/60+54.27/3600], //left, bottom, right, top
                },
                arenaTiles: {
                    type: 'raster',
                    tiles: ['./data/kisakeskus/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: 'Jukola 2025',
                    maxzoom: 20,
                    minzoom: 14,
                    bounds: [27.1469199103726879, 61.6373892963511452, 27.1555165538415046, 61.6441650587566485]
                },
                forbiddenAreaPolygon: {
                    type: 'geojson',
                    data: './data/kieltoalue.geojson'
                },
                tentSource: {
                    type: 'geojson',
                    data: './data/tents.geojson',
                },
                terrainSource: {
                  type: 'raster-dem',
                  url: './data/elevation/tileset.json',
                  tileSize: 256
                },
                hillshadeSource: {
                  type: 'raster',
                  url: './data/hillshade/tileset.json',
                  tileSize: 256
                }
            },
            layers: [
                {
                    id: 'mapant',
                    type: 'raster',
                    source: 'mapantTiles',
                    maxzoom: 20,
                },
                {
                  id: 'gSat',
                  type: 'raster',
                  source: 'gSatTiles',
                  maxzoom: 20,
                  layout: {
                    'visibility': 'none' // Default visibility is none
                  }
                },
                {
                    id: 'oldMaps',
                    type: 'raster',
                    source: 'oldMapTiles',
                },
                {
                  id: 'arena',
                  type: 'raster',
                  source: 'arenaTiles',
                },
                {
                    id: 'hillshade',
                    type: 'raster',
                    source: 'hillshadeSource',
                    paint: { 'raster-opacity': 0.6 },
                    layout: { 'visibility': 'none' }
                },
                {
                  id: 'tentFill',
                  type: 'fill',
                  source: 'tentSource',
                  layout: {
                    'visibility': 'visible',
                  },
                  paint: {
                    'fill-color': '#DADADA',
                  },
                },
                {
                  id: 'tentBorder',
                  type: 'line',
                  source: 'tentSource',
                  layout: {
                    'visibility': 'visible',
                  },
                  paint: {
                    'line-color': '#000000',
                    'line-width': [
                      'interpolate', 
                      // ['linear'], 
                      // ['zoom'], 
                      // 10, 1, 
                      // 24, 2
                      ['exponential', 2], 
                      ['zoom'],
                      12, ["*", .75, ["^", 2, -2]], 
                      24, ["*", .75, ["^", 2, 8]]
                    ]
                  },
                },
                {
                    id: 'forbiddenArea',
                    type: 'line',
                    source: 'forbiddenAreaPolygon',
                    paint: {
                      'line-color': '#CC29CC',
                      'line-width':  [
                        'interpolate', 
                        // ['linear'], 
                        // ['zoom'], 
                        // 10, 2, 
                        // 24, 3
                        ['exponential', 2], 
                        ['zoom'],
                        12, ["*", 10, ["^", 2, -2]], 
                        24, ["*", 10, ["^", 2, 8]]
                    ],
                    }
                },
            ],
        },
        center: [lng, lat],
        zoom: zoom,
        maxZoom: 18,
        minZoom: 10,
      });
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(
        new maplibregl.TerrainControl({
            source: 'terrainSource',
            exaggeration: 2,
        })
      );
      map.current.addControl(new MeasureControl());
      map.current.on('terrain', (e) => { // Toggle hillshade on terrain display changes
        if (e.terrain) {
          map.current.setLayoutProperty('hillshade', 'visibility', 'visible');
        } else {
          map.current.setLayoutProperty('hillshade', 'visibility', 'none');
        }
      });
    });

    if (map.current) {
      map.current.setLayoutProperty('mapant', 'visibility', bgMap === 'MapAnt' ? 'visible' : 'none');
      map.current.setLayoutProperty('gSat', 'visibility', bgMap === 'gSat' ? 'visible' : 'none');
      Object.entries(overlayVisibility).forEach(([overlay, state]) => {
        map.current.setLayoutProperty(overlay, 'visibility', state);
      });
    }
  
    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        <div id="distance" className="distance-container"></div>
      </div>
    );
  }