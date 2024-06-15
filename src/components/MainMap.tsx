import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import mapboxgl from "mapbox-gl";
import Map, { Source, Layer, GeolocateControl, MapRef } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { FeatureCollection } from "geojson";

import { lngLatBoundsToPolygon } from "@/utils/latLngBoundsToPolygon";
import { ViewportProps } from "@/types/ViewportProps";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapProps {
  sidewalkFeatureCollection: FeatureCollection;
  savedBounds: LngLatBounds | undefined;
  setBounds: (bounds: LngLatBounds) => void;
  viewport: ViewportProps;
  setViewport: (viewport: ViewportProps) => void;
  mapRef: React.RefObject<MapRef>;
}
export const MainMap = ({
  sidewalkFeatureCollection,
  savedBounds,
  setBounds,
  viewport,
  setViewport,
  mapRef,
}: MapProps) => {
  const geocoderContainerRef = useRef<any>(null);
  const geolocateControlRef = useRef<any>(null);
  const [mapInstance, setMapInstance] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        proximity: {
          longitude: center.lng,
          latitude: center.lat,
        },
      });
      geocoder.addTo(geocoderContainerRef.current);

      geocoder.on("result", (e) => {
        mapInstance.flyTo({
          center: e.result.center,
          zoom: 14,
        });
      });
    }
  }, [mapInstance]);

  const updateURL = (latitude: number, longitude: number, zoom: number) => {
    router.replace(
      `/${latitude.toFixed(7)}/${longitude.toFixed(7)}/${zoom.toFixed(2)}`
    );
  };

  const saveLocation = (latitude: number, longitude: number, zoom: number) => {
    localStorage.setItem("latitude", latitude.toString());
    localStorage.setItem("longitude", longitude.toString());
    localStorage.setItem("zoom", zoom.toString());
  };

  return (
    <div className="map-container">
      <Map
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        onMoveEnd={async (e) => {
          setBounds(e.target.getBounds());
          const latitude = e.target.getCenter().lat;
          const longitude = e.target.getCenter().lng;
          const zoom = e.target.getZoom();
          setViewport({ latitude, longitude, zoom });
          updateURL(latitude, longitude, zoom);
          saveLocation(latitude, longitude, zoom);
        }}
        onRender={(e) => {
          setBounds(e.target.getBounds());
          setViewport({
            longitude: e.target.getCenter().lng,
            latitude: e.target.getCenter().lat,
            zoom: e.target.getZoom(),
          });
        }}
        ref={mapRef}
        onLoad={(e) => {
          setMapInstance(e.target);
        }}
      >
        <div className="z-1 absolute bottom-4 left-4">
          <GeolocateControl
            ref={geolocateControlRef}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onGeolocate={(pos: GeolocationPosition) => {
              setViewport({
                ...viewport,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            }}
          />
        </div>
        <div ref={geocoderContainerRef} className="z-1 fixed top-2 right-12" />
        <Source type="geojson" data={sidewalkFeatureCollection}>
          <Layer
            id="Data"
            type="line"
            paint={{
              "line-color": "red",
              "line-opacity": 0.8,
              "line-width": 3,
            }}
          />
        </Source>
        {savedBounds && (
          <Source
            id="bounds-polygon"
            type="geojson"
            data={lngLatBoundsToPolygon(savedBounds)}
          >
            <Layer
              id="bounds-polygon-layer"
              type="line"
              paint={{
                "line-color": "blue",
                "line-width": 2,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};
