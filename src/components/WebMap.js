import React, { useEffect,useState } from "react";
import {Cartesian3} from 'cesium';
import { Viewer, Camera } from "cesium-react";

//Initialize global variables
let viewer;
let mapWidth;
let mapHeight;

//Definitions of conversion methods
function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}
function radiansToDegrees(pixel) {
  return (pixel*180)/Math.PI ;
}
//Exporting a React method which includes the components of the web page
export function WebMap() {
  //Declaring useState hooks
  const [topPos, setTop] = useState(0);
  const [leftPos, setLeft] = useState(0);

  //A methos that controls Cesium's camera postion
  const flyto=(camera,evt)=>{
    evt.persist();
    let x = evt.nativeEvent.offsetX;
    let y = evt.nativeEvent.offsetY;
    let coords = pixel2LatLon(x,y);
    camera.flyTo({destination:Cartesian3.fromDegrees(coords.lon, coords.lat,500000.0)});
  }

  //This method converting cartesian coordinates to lon lat and afterward to pixel position
  const handleConversion = (coords)=>{
    let pos = Cesium.Cartographic.fromCartesian(coords)
    let lat=pos.latitude / Math.PI * 180;
    let lon=pos.longitude / Math.PI * 180;
    return latLonToTopLeft(lat,lon);
  }
  
  //A conversion method from pixel xy to lon lat
  const pixel2LatLon =(x, y)=> {
    let radDeg;
    let FE = 180;
    let radius = mapWidth / (2 * Math.PI);
    let x_radius= (x/radius)-0.1;
    let y_equator= (mapHeight / 2) - y;
    let power=Math.pow(10,(y_equator/radius));
    let rad=Math.atan(power);
    if (rad>1){
      radDeg=(rad-(Math.PI/4))*(rad-0.1);
    }
    else{
      console.log((1-rad)*2);
      radDeg=(rad-(Math.PI/4))*(((1-rad)*2)-0.1);
    }
    let lat = radiansToDegrees(radDeg);
    let lonDeg = radiansToDegrees(x_radius);
    let lon = lonDeg-FE;
    return {
      'lon' : lon,
      'lat' : lat
    };
  }
  //A conversion method from lon lat to pixel xy
  const latLonToTopLeft =(lat, lon)=> {
    let FE = 180;
    let radius = mapWidth / (2 * Math.PI);
    let latRad = degreesToRadians(lat);
    let lonRad = degreesToRadians(lon + FE);
    let x = lonRad * radius;
    let yFromEquator = radius * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    let y = mapHeight / 2 - yFromEquator;
    if (y>=mapHeight-10){
      y=mapHeight-10;
    }
    else if (y<=0){
      y=1;
    }
    setTop(y);
    setLeft(x);
    return {
      'left' : x,
      'top' : y
    };
  
  };
 
  useEffect(_=>{
    //Receiving image dimensions dynamically
    let url = 'static/globe.png';
    let imageSrc = url;
    let image = new Image();
    image.src = imageSrc;
    mapWidth=image.width;
    mapHeight=image.height;
    //Updating the init location on the map
    setTimeout(()=>{
      let initCoords=viewer.cesiumElement.scene.camera.position;
      handleConversion(initCoords)
    },1500);
  });
  
  return (
    <div style={{position:'absolute',height:'100vh',width:'100vw',top:'0',left:'0'}}>
    <Viewer style={{position: 'absolute',left:'0',top: '0',width:'50vw',height:'100%'}}  ref={e => { viewer = e; }}>
      <Camera onMoveEnd={()=>handleConversion(viewer.cesiumElement.scene.camera.position)}/>
      </Viewer>
    <div style={{position:'absolute',right:'10%',top:'35%'}}>
      <img src="static/arrow.png" style={{height:'15px',width:'15px',position:'absolute',top:` ${topPos}`+'px',left:` ${leftPos}`+'px'}}/>
    <img  id="globe" src="static/globe.png" onClick={(e)=>flyto(viewer.cesiumElement.scene.camera,e)}/>
    </div>
    </div>
    
  )
}
 
