import { ViewportProps } from "@/types/ViewportProps";
import { LngLatBounds } from "mapbox-gl";
import { FeatureCollection } from "geojson";

export interface MapProps {
  sidewalkFeatureCollection: FeatureCollection;
  loading: boolean;
  savedBounds: LngLatBounds | undefined;
  showZoomModal: boolean;
  showInfoModal: boolean;
  setShowZoomModal: (showZoomModal: boolean) => void;
  setShowInfoModal: (showInfoModal: boolean) => void;
  setBounds: (bounds: LngLatBounds) => void;
  viewport: ViewportProps;
  setViewport: (viewport: ViewportProps) => void;
  mapRef: React.RefObject<any>;
}
