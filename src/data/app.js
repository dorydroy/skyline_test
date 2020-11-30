import WebMap from "esri/WebMap";
import Map from "esri/Map";
import MapView from "esri/views/MapView";
import Search from "esri/widgets/Search";
import SceneView from "esri/views/SceneView";
import FeatureLayer from "esri/layers/FeatureLayer"
import WebScene from 'esri/WebScene';

const noop = () => {};

/*export const webmap = new WebMap({
  portalItem: {
    id: "7c7369ca4ad64635b5748f50a44248aa"
  }
});

export const view = new MapView({
  map: webmap
});*/

export const featureLayer = new FeatureLayer({
  url:
    "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
});
export const scenery = new WebScene({
  portalItem: { // autocasts as new PortalItem()
    id: "a9d189bddb99463ebea402584bb1c9be"  // ID of the WebScene on arcgis.com
  }
});
export const map = new Map({
  basemap: "topo-vector",
  ground: "world-elevation"
});


export const view = new SceneView({
  container: "viewDiv",
  map: scenery,
  camera: {
    position: {
      x: 35.215,
      y: 31.735,
      z: 2000 // meters
    },
    tilt: 75
  }
});
export const search = new Search({ view });
view.ui.add(search, "top-right");

export const initialize = (container) => {
  view.container = container;
  view
    .when()
    .then(_ => {
      console.log("Map and View are ready");
    })
    .catch(noop);
  return () => {
    view.container = null;
  };
};

