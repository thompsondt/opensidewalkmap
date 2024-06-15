import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { LngLatBounds } from "mapbox-gl";
import { FeatureCollection } from "geojson";
import { MapRef } from "react-map-gl";

import { Window } from "@/components/Window";
import { validateViewport } from "@/utils/validateViewport";
import { defaultViewport } from "@/config/defaults";
import { MainMap } from "@/components/MainMap";

export const MainPage = () => {
  const [bounds, setBounds] = useState<LngLatBounds>();
  const [savedBounds, setSavedBounds] = useState<LngLatBounds>();
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  } as FeatureCollection);
  const [viewport, setViewport] = useState(defaultViewport);
  const mapRef = useRef<MapRef>(null);
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const { latitude, longitude, zoom } = router.query;

  // Init map location from URL or local storage
  useEffect(() => {
    const isValidViewport = validateViewport(latitude, longitude, zoom);
    if (!isValidViewport || !mapRef.current) return;
    if (initialized) return;

    const urlLatitude = Number(latitude);
    const urlLongitude = Number(longitude);
    const urlZoom = Number(zoom);

    const localLatitude = localStorage.getItem("latitude") as string;
    const localLongitude = localStorage.getItem("longitude") as string;
    const localZoom = localStorage.getItem("zoom") as string;

    const map = mapRef.current.getMap();
    if (localLatitude || localLongitude || localZoom)
      map.jumpTo({
        center: [urlLongitude, urlLatitude],
        zoom: urlZoom,
      });
    else if (urlLatitude || urlLongitude || urlZoom)
      map.jumpTo({
        center: [urlLongitude, urlLatitude],
        zoom: urlZoom,
      });

    setInitialized(true);
  }, [initialized, latitude, longitude, zoom]);

  return (
    <div className="map-page">
      <Window
        bounds={bounds}
        setSavedBounds={setSavedBounds}
        featureCollection={featureCollection}
        setFeatureCollection={setFeatureCollection}
        viewport={viewport}
      />
      <MainMap
        sidewalkFeatureCollection={featureCollection}
        savedBounds={savedBounds}
        setBounds={setBounds}
        viewport={viewport}
        setViewport={setViewport}
        mapRef={mapRef}
      />
    </div>
  );
};

export default MainPage;
