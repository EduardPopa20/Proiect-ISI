import { useRef, useEffect, useState } from "react";
import ArcGISMap from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";
import MapView from "@arcgis/core/Views/MapView";
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import { solve } from "@arcgis/core/rest/route";


const ViewMap = () => {
  const mapRef = useRef();
  const viewRef = useRef();
  const routeUrl =
    "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";


  const samplePoints = [
    [44.42740653731108, 26.05824533838864], 
    [44.40827938495116, 26.08347955926633],
    [44.44285082346673, 26.075583136406642],
    [44.390495331061295, 26.166048681632976],
    [44.452286988938845, 26.139956148849734],
    [44.39932670956159, 26.077814734171337],
    [44.390495331061295, 26.166048681632976],
  ];

  useEffect(() => {

    esriConfig.apiKey = "AAPKeb62f5f7bd2247559a15a90d1f0793027a9QbG68B_J4KLymxgPFVKLvgGT16REirWHCgSjb0UzSkPDE5kncCC9s2zce4j5u";
    const loadMap = async () => {
      try {
        const map = new ArcGISMap({
          basemap: "topo-vector",
        });
    
        const view = new MapView({
          container: mapRef.current,
          map,
          center: [26.102071251636296, 44.42778827633022],
          zoom: 12,
        });
        
        viewRef.current = view;
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);
    
        if (samplePoints.length > 0) {
          samplePoints.forEach((pointCoordinates, index) => {
            const [latitude, longitude] = pointCoordinates;
    
            const point = new Point({
              latitude,
              longitude,
            });
    
            const pointGraphic = new Graphic({
              geometry: point,
              symbol: {
                type: 'simple-marker',
                color: [255, 0, 0],
                outline: {
                  color: [255, 255, 255],
                  width: 1,
                },
                size: 10,
              },
              attributes: {
                name: `Point ${index + 1}`,
              },
            });
    
            graphicsLayer.add(pointGraphic);
          });
          const stops = samplePoints.map((point) => ({
            geometry: new Point({
              latitude: point[0],
              longitude: point[1],
            }),
          }));
          
          if (stops && stops.length > 1 && stops.length) {
            const optimizedStops = optimizeRoute(stops);
            const routeParams = new RouteParameters({
              stops: new FeatureSet({
                features: optimizedStops.map((stop, i) =>
                  new Graphic({
                    geometry: stop.geometry,
                    attributes: { Name: `Stop ${i + 1}` },
                  })
                ),
              }),
              returnDirections: true,
            });

            let routeGraphics = [];

            solve(routeUrl, routeParams)
              .then(function (data) {
                data.routeResults.forEach(function (result) {
                  const routeGraphic = new Graphic({
                    geometry: result.route.geometry,
                    symbol: {
                      type: "simple-line",
                      color: [0, 0, 0.2],
                      width: 0.01,
                    },
                  });
                  routeGraphics.push(routeGraphic);
                  graphicsLayer.add(routeGraphic);
          });

          displayDirections(data.routeResults[0].directions.features);

          const movingPointGraphic = new Graphic({
            geometry: new Point({
              latitude: samplePoints[0][0],
              longitude: samplePoints[0][1],
            }),
            symbol: {
              type: "simple-marker",
              color: [0, 255, 0],
              outline: {
                color: [255, 255, 255],
                width: 1,
              },
              size: 10,
            },
            attributes: {
              name: "Moving Point",
            },
          });

          graphicsLayer.add(movingPointGraphic);

          let currentIndex = 0;
          const speedFactor = 0.1; 
          let continueAnimation = true;
          let popupTimeout = null;
          const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
          
          const movePoint = async () => {
            while (continueAnimation) {
              const nextStop = optimizedStops[(currentIndex + 1) % optimizedStops.length];
              const currentPoint = movingPointGraphic.geometry;
          
              const newPoint = new Point({
                latitude: currentPoint.latitude + (nextStop.geometry.latitude - currentPoint.latitude) * speedFactor,
                longitude: currentPoint.longitude + (nextStop.geometry.longitude - currentPoint.longitude) * speedFactor,
              });
          
              movingPointGraphic.geometry = newPoint;
          
              const distanceToNextStop = calculateDistance(currentPoint, nextStop.geometry);
              if (distanceToNextStop < 0.0001) {
                currentIndex = (currentIndex + 1) % optimizedStops.length;
          
                const screenCoordinates = viewRef.current.toScreen(nextStop.geometry);
          
                await new Promise(resolve => {
                  viewRef.current.popup.open({
                    title: "Destination Reached",
                    content: `<div>You have reached the destination</div>`,
                    location: viewRef.current.toMap({
                      x: screenCoordinates.x,
                      y: screenCoordinates.y,
                    }),
                    actions: [{
                      title: "Continue",
                      id: "continue",
                    }],
                  });
          
                  const checkPopupVisibility = () => {
                    if (viewRef.current.popup.visible) {
                      viewRef.current.popup.on("trigger-action", (event) => {
                        if (event.action.id === "continue") {
                          viewRef.current.popup.close();
                          resolve();
                        }
                      });
                    } else {
                      popupTimeout = setTimeout(checkPopupVisibility, 100);
                    }
                  };
          
                  checkPopupVisibility();
                });
              }
          
              await delay(100); 
            }
          };
          movePoint();
              })
              .catch(function (error) {
                console.error("Error calculating route", error);
              });
          } else {
            console.error("Error: Not enough stops for route calculation");
          }


          function optimizeRoute(stops) {
            const optimizedStops = [];
            const remainingStops = [...stops];

            let currentStop = remainingStops.shift();
            optimizedStops.push(currentStop);

            while (remainingStops.length > 0) {
              const nearestNeighbor = findNearestNeighbor(currentStop, remainingStops);
              currentStop = remainingStops.splice(nearestNeighbor.index, 1)[0];
              optimizedStops.push(currentStop);
            }

            return optimizedStops;
          }

          function displayDirections(directionsFeatures) {
            const directionsContainer = document.getElementById("directions-container");
          
            if (directionsContainer) {
              directionsContainer.innerHTML = "<h3>Turn-by-Turn Directions:</h3>";
          
              directionsFeatures.forEach((feature, index) => {
                const instruction = feature.attributes.text;
                const directionItem = document.createElement("div");
                directionItem.textContent = `${index + 1}. ${instruction}`;
                directionsContainer.appendChild(directionItem);
              });
            }
          }

          function findNearestNeighbor(currentStop, remainingStops) {
            let minDistance = Infinity;
            let nearestNeighbor;
            
            remainingStops.forEach((stop, index) => {
              const distance = calculateDistance(currentStop.geometry, stop.geometry);
              if (distance < minDistance) {
                minDistance = distance;
                nearestNeighbor = { index, distance };
              }
            });

            return nearestNeighbor;
          }

          function calculateDistance(point1, point2) {
            return Math.sqrt(
              Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
            );
          }


          const extractDestinationName = (stop) => {
            if (stop && stop.attributes) {
              if (stop.attributes.Name) {
                return stop.attributes.Name;
              } else if (stop.attributes["name"]) {
                return stop.attributes["name"];
              }
            }
            return null;
          };
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
          
    };
    
    loadMap();
  }, []);

  return (
    <div>
      <div id="map" ref={mapRef} style={{ width: "100%", height: "500px" }} />
      <div
        id="directions-container"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          maxWidth: "200px",
          maxHeight: "250px", 
          overflow: "auto",
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3>Turn-by-Turn Directions:</h3>
        
      </div>
    </div>
  );
}

export default ViewMap;