import { useEffect, useState, useCallback, memo } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from "wouter";

import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

import { useTheme } from '@mui/material/styles';

function MapsPage({ googleMapsApiKey, latitude: latitudeProp, longitude: longitudeProp, containerStyle={} }) {
  const theme = useTheme();

  const [location, setLocation] = useLocation();

  const [position, setPosition] = useState({
    latitude: latitudeProp,
    longitude: longitudeProp
  });

  const {
    latitude,
    longitude
  } = position;

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * (Math.PI / 180);
    const phi2 = lat2 * (Math.PI / 180);
    const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
    const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    return distance;
  }

  const shouldUpdate = (
    calculateDistance(latitude, longitude, latitudeProp, longitudeProp) > 10
    || (!latitude && latitudeProp)
  );

  if(shouldUpdate) {
    console.log('updating position')
    setPosition({
      latitude: latitudeProp,
      longitude: longitudeProp
    })
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey
  })

  const center = {
    lat: latitude,
    lng: longitude
  };

  const onLoad = function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);

    const styledMapTypes = {
      light: new window.google.maps.StyledMapType(
        [
          { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#c9b2a6" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [{ color: "#dcd2be" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ae9e90" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#93817c" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#a5b076" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#447530" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#f5f1e6" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#fdfcf8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f8c967" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e9bc62" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#e98d58" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ color: "#db8555" }],
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#806b63" }],
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [{ color: "#8f7d77" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ebe3cd" }],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#b9d3c2" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#92998d" }],
          },
        ],
        { name: "light" },
      ),
      dark: new window.google.maps.StyledMapType(
        [
          {
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          },
        ],
        { name: "light" }
      )
    };

    map.mapTypes.set("styled_map", styledMapTypes[theme.palette.mode]);
    map.setMapTypeId("styled_map");
    map.setCenter(center)
  }

  // const path = [
  //   {
  //     lat: ...,
  //     lng: ...
  //   },
  //   {
  //     lat: ...,
  //     lng: ...
  //   },
  // ]

  if(isLoaded && latitude && longitude) {
    return (
      <GoogleMap
        key={`google-map-${theme.palette.mode}`}
        mapContainerStyle={containerStyle}
        // center={center}
        onLoad={onLoad}
        // onUnmount={...}
        zoom={14}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: false,
          mapTypeControl: false
        }}
      >
        {/*<Polyline
          traffic={new window.google.maps.TrafficLayer()}
          path={path}
          options={{
            strokeColor: "red",
            strokeWeight: 6,
            strokeOpacity: 0.6,
          }}
        />*/}
        <Marker
          position={center}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillOpacity: 0.6,
            strokeWeight: 2,
            fillColor: theme.palette.info.light,
            strokeColor: theme.palette.info.main,
          }}
        />
      </GoogleMap>
    )
  }
}

export default MapsPage