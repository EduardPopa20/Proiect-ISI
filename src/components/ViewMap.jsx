import { useRef, useEffect } from "react";

import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/Views/MapView";

const ViewMap = () => {
  const mapRef = useRef();
  useEffect(() => {
    const map = new ArcGISMap({
      basemap: "topo-vector",
    });
    const view = new MapView({
      container: mapRef.current,
      map,
      center: [-95.7129, 37.0902],
      zoom: 8,
    });
  }, []);
  return <div id="map" ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default ViewMap;
