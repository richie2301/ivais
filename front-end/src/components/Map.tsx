import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "../App.css";
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
declare const MapboxGeocoder: any;

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;

type MapProps = {
  latitude: (value: number) => void;
  longitude: (value: number) => void;
}

const Map: React.FC<MapProps> = ({latitude, longitude}) => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(106.816666);
  const [lat, setLat] = useState(-6.200000);
  const [zoom, setZoom] = useState(14);

  const coordinatesGeocoder = function (query: string) {
    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(
    /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
    );
    if (!matches) {
    return null;
    }
     
    function coordinateFeature(lng: number, lat: number) {
    return {
    center: [lng, lat],
    geometry: {
    type: 'Point',
    coordinates: [lng, lat]
    },
    place_name: 'Lat: ' + lat + ' Lng: ' + lng,
    place_type: ['coordinate'],
    properties: {},
    type: 'Feature'
    };
    }
     
    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];
     
    if (coord1 < -90 || coord1 > 90) {
    // must be lng, lat
    geocodes.push(coordinateFeature(coord1, coord2));
    }
     
    if (coord2 < -90 || coord2 > 90) {
    // must be lat, lng
    geocodes.push(coordinateFeature(coord2, coord1));
    }
     
    if (geocodes.length === 0) {
    // else could be either lng, lat or lat, lng
    geocodes.push(coordinateFeature(coord1, coord2));
    geocodes.push(coordinateFeature(coord2, coord1));
    }
     
    return geocodes;
    };

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once and if mapContainer.current is not null
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(new mapboxgl.FullscreenControl());
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    map.current.addControl(
      geolocate
    );

    geolocate.on('geolocate', function(e: any) {
        setLng(e.coords.longitude);
        setLat(e.coords.latitude);
        setZoom(14);
        console.log('A geolocate event has occurred.')
    });

    map.current.on('load', function() {
        onDragEnd();
    })

    // map.current.addControl(
    //   new MapboxDirections({
    //     accessToken: mapboxgl.accessToken,
    //   }),
    //   "top-left"
    // );

    // map.current.addControl(
    //     new mapboxgl.Marker(
    //         {
    //             draggable: true,
    //         }
    //     )
    //         .setLngLat([lng, lat])
    //         .addTo(map.current)
    // );

        // Add the control to the map.

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 14,
        placeholder: 'Enter location name or coordinates',
        mapboxgl: mapboxgl,
        reverseGeocode: true,
        marker: false,
        flyTo: {
            animate: false,
        }
        })

    map.current.addControl(
        geocoder,
        "top-left"
        );

        

        const marker = new mapboxgl.Marker(
            {
                draggable: true,
            }
        )
            .setLngLat([lng, lat])
            .addTo(map.current);

            
    
        function onDragEnd() {
            const lngLat = marker.getLngLat();
            const coordinates = document.getElementById('coordinates')!;
            coordinates.style.display = 'block';
            coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
            console.log('this run')
            latitude(lngLat.lat)
            longitude(lngLat.lng)
            }
                
            marker.on('dragend', onDragEnd);

            // geocoder.on('move', () => {
            //     marker.setLngLat(geocoder.getCenter());
            //     console.log('this run')
            // })
            // return () => marker.remove();
       
            geocoder.on('result', function(e: any) {
                console.log(e.result);
                marker.setLngLat(e.result.center);
                onDragEnd();
            });

            geolocate.on('geolocate', (e: any) => {
              if (map.current) {
                map.current.flyTo({
                  center: [e.coords.longitude, e.coords.latitude],
                  zoom: 14,
                  duration: 0
                });
              }
              });
  }, [lng, lat, zoom]);

//   useEffect(() => {
//     const marker = new mapboxgl.Marker(
//         {
//             draggable: true,
//         }
//     )
//         .setLngLat([lng, lat])
//         .addTo(map.current);

//     function onDragEnd() {
//         const lngLat = marker.getLngLat();
//         coordinates.style.display = 'block';
//         coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
//         }
            
//         marker.on('dragend', onDragEnd);
//         return () => marker.remove();
//     }, [lng, lat]);

  //move marker when search new location

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current?.on("move", () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

  return (
    <div className="App" style={{height: '300px'}}>
      <div ref={mapContainer} className="map-container">
      <pre id="coordinates" className="coordinates"></pre>
      </div>
    </div>
  );
}

export default Map;