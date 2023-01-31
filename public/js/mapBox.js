/* eslint-disable */
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
//
export const displayMap = (locations) => {



mapboxgl.accessToken =
  "pk.eyJ1IjoibWF0aGV3Y29kZXgiLCJhIjoiY2xieWZ6aDRuMWd1NjNvbnl2emZ0ZHEzOCJ9.JQB5KDl_SUax9YUmQITT0Q";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mathewcodex/clc4q8w7i001i14quluef0nme",
  scrollZoom:false,
//   center: [-118.113491, 34.111745],
  //zoom: 10,
});

//creating a bount variable
const bounds = new mapboxgl.LngLatBounds();
locations.forEach((loc) => {
  //create Marker
  const el = document.createElement("div");
  el.className = "marker";

  //add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //addd popup


  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates) 
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);


  //extending boundary  to includes the current location

  bounds.extend(loc.coordinates);
});

//making the maP fit bounds
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
}