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
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { solve } from "@arcgis/core/rest/route";
import "./ViewMap.css";
import { getCurrentUser } from "../services/users";
import { doc, getDoc , getDocs, collection, query, where } from "firebase/firestore"
import { db } from "../services/firebase"
import { updateOrderStatus } from "../services/orders"

const ViewMap = () => {
  const mapRef = useRef();
  const viewRef = useRef();
  const routeUrl =
    "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";


  useEffect(() => {


    const loadMap = async () => {
      try {

         esriConfig.apiKey = "AAPKeb62f5f7bd2247559a15a90d1f0793027a9QbG68B_J4KLymxgPFVKLvgGT16REirWHCgSjb0UzSkPDE5kncCC9s2zce4j5u";
         const currentUser = await getCurrentUser();
         const ordersCollectionRef = collection(db, 'orders');
         const getOrdersForCurrentUser = async (currentUser) => {
          try {
            if (!currentUser || !currentUser.uid) {
              console.error('Invalid currentUser object:', currentUser);
              return [];
            }
        
            const ordersQuery = query(
              ordersCollectionRef,
              where('courierId', '==', currentUser.uid)
            );
        
            const ordersSnapshot = await getDocs(ordersQuery);
            const samplePoints = [];
            samplePoints.push([44.43630348307506, 26.094558822089272]); //location of garage
            const ordersWithDetails = [];
            for (const orderDoc of ordersSnapshot.docs) {
              const orderData = orderDoc.data();
              if (orderData.location_id) {
                const locationId = orderData.location_id;
                const locationDoc = await getDoc(doc(db, 'locations', locationId));
                const locationDetails = locationDoc.data();
                const orderWithDetails = {
                  orderId: orderDoc.id,
                  ...orderData,
                  locationDetails,
                };
                console.log(orderWithDetails)
                ordersWithDetails.push(orderWithDetails);
                samplePoints.push([locationDetails.latitude, locationDetails.longitude]);
                
              } else {
                console.error('Location ID is undefined or null for order:', orderDoc.id);
              }
            }
              return {ordersWithDetails, samplePoints};
          } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
          }
        };
        const {ordersWithDetails , samplePoints } = await getOrdersForCurrentUser(currentUser);
        console.log(samplePoints)
        console.log(ordersWithDetails)
        
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
        
        const gasStationLayerUrl = "https://services.arcgis.com/QdgN7M954kkInJsA/arcgis/rest/services/Benzinarii/FeatureServer";
        const gasStationLayer = new FeatureLayer({
          url: gasStationLayerUrl,
          outFields: ["*"],
          visible: true,
          renderer: {
            type: "simple",
            symbol: {
              type: "simple-marker",
              color: [0, 0, 255],
              outline: {
                color: [255, 255, 255],
                width: 1
              },
              size: 8
            }
          } 
        });

        map.add(gasStationLayer);
       
        
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
                size: 12,
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
          
          if (stops && stops.length > 1) {
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
                      color: [0, 0, 0],
                      width: 2,
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
          let totalDistance = optimizedStops.reduce((acc, _, index, array) => {
            if (index < array.length - 1) {
              const currentPoint = optimizedStops[index].geometry;
              const nextPoint = optimizedStops[index + 1].geometry;
              return acc + calculateDistanceToNextPoint(currentPoint, nextPoint);
            }
            return acc;
          }, 0);
          const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

          
          const movePoint = async () => {
            let nextPoint;
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
                console.log(currentIndex)
                console.log(optimizedStops.length)
                if (currentIndex == optimizedStops.length - 1) {
                   nextPoint = optimizedStops[0].geometry;
                  }
                else {
                   nextPoint = optimizedStops[currentIndex + 1].geometry;
                }
                const displayDistance = calculateDistanceToNextPoint(newPoint, nextPoint);
                const actualDistance = calculateDistanceToNextPoint(optimizedStops[currentIndex].geometry, optimizedStops[currentIndex - 1].geometry);
                totalDistance = totalDistance - actualDistance;

                await new Promise(resolve => {
                  viewRef.current.popup.open({
                    title: "Destination Reached",
                    content:  
                              
                              `${currentIndex === optimizedStops.length - 1 ? 
                              `<div>Congratulations, you reached the ${getOrdinal(currentIndex)} and final destination of the day !</div>`
                              : `<div>You have reached the ${getOrdinal(currentIndex)} destination </div>` }
                              ${currentIndex === optimizedStops.length - 1 ? `<div>Please return to garage, you have ${displayDistance.toFixed(2)} km back to garage` 
                              : `<div>You have ${displayDistance.toFixed(2)} km remaining to the next destination </div>` }
                              ${currentIndex === optimizedStops.length - 1 ? ' ' 
                              : `<div>Total Distance Remaining : ${totalDistance.toFixed(2)} km</div>` }`,
                             
                    actions: [
                      {
                        title: "Delivered",
                        id: "check-mark",
                        className: "check-mark-button",
                      } ,
                      {
                        title: "Not Delivered",
                        id: "uncheck-mark",
                        className: "uncheck-mark-button",
                      },
                  ],
                  });
          
                  const checkPopupVisibility = () => {
                    if (viewRef.current.popup.visible) {
                      viewRef.current.popup.on("trigger-action", (event) => {
                        
                        if (event.action.id === "check-mark" || event.action.id === "uncheck-mark") {
                          viewRef.current.popup.close();
                          if (currentIndex < samplePoints.length) {
                            handlePopupAction(ordersWithDetails[currentIndex - 1].orderId, event.action.id);
                            console.log(ordersWithDetails[currentIndex - 1].orderId)
                          }
                          resolve();
                        }
                      });
                    } else {
                      setTimeout(checkPopupVisibility, 100);
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

          const handlePopupAction = async (orderId, actionId) => {
            switch (actionId) {
              case "check-mark":
                try {
                  await updateOrderStatus(orderId, true);
                } catch (error) {
                  console.error("Error updating order status:", error);
                }
                break;
              default:
                break;
            }
          };

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
            const x1 = point1.longitude;
            const y1 = point1.latitude;
            const x2 = point2.longitude;
            const y2 = point2.latitude;
            const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          
            return distance;
          }


          function calculateDistanceToNextPoint(currentPoint, lastPoint) {
            const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
            const earthRadiusKm = 6371; 
          
            const lat1 = degreesToRadians(currentPoint.latitude);
            const lon1 = degreesToRadians(currentPoint.longitude);
            const lat2 = degreesToRadians(lastPoint.latitude);
            const lon2 = degreesToRadians(lastPoint.longitude);
            const dlat = lat2 - lat1;
            const dlon = lon2 - lon1;
          
            const a =
              Math.sin(dlat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
          
            const c = 2 * Math.asin(Math.sqrt(a));
      
            const distance = earthRadiusKm * c;
          
            return distance;
          }

          function getOrdinal(number) {
            const suffixes = ["th", "st", "nd", "rd"];
            const lastDigit = number % 10;
            const specialSuffix = (number % 100 - lastDigit) / 10 === 1 ? "th" : "";
          
            return number + (suffixes[lastDigit] || specialSuffix || "th");
          }
          
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
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1, 
          maxWidth: "300px",
          maxHeight: "420px", 
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