import React, { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import esriConfig from "@arcgis/core/config";

const SearchBarArcGis = ({ onSearch }) => {
  const mapRef = useRef(null);

  esriConfig.apiKey = "AAPKbceff60313154e60a2bd3ca01025068aj6f7YbDltqKA5GvW0w-uJJ8tMa21V5lEgi48QuNejDU4KFR6ePsTKJHx9f2PRpQq";

  useEffect(() => {
    let searchWidget;

    loadModules(['esri/Map', 'esri/views/MapView', 'esri/widgets/Search', 'esri/geometry/Extent'], { css: true })
      .then(([Map, MapView, Search, Extent]) => {
        const romaniaExtent = new Extent({
          xmin: 19.6225,
          ymin: 43.6211,
          xmax: 29.6269,
          ymax: 48.2578,
          spatialReference: {
            wkid: 4326,
          },
        });

        const map = new Map({
          basemap: 'streets-navigation-vector',
        });

        const view = new MapView({
          map,
          container: mapRef.current,
          zoom: 10, 
          center: [26.096306, 44.439663],
          extent: romaniaExtent
        });

        mapRef.current = view;

        searchWidget = new Search({
          view: view,
        });

        searchWidget.on('search-complete', (event) => {
          onSearch(event.results);
        });

        view.ui.add(searchWidget, {
          position: 'top-right',
        });
      })
      .catch((err) => console.error('Error loading ArcGIS modules:', err));

    return () => {
      if (searchWidget) {
        searchWidget.destroy();
      }
    };
  }, [onSearch]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>;
};

export default SearchBarArcGis;