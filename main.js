import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {useGeographic} from 'ol/proj';
import {Point} from 'ol/geom';
import {Feature,} from 'ol/index';
import {Circle, Style, Fill} from 'ol/style';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';



window.onload=init;
async function init(){

const myView=new View({
    center: [0, 0],
    zoom: 2
  })


//layers
const basicLayer=new TileLayer({source: new OSM()})

const countriesLayer=new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: './data/countries.json'
  })
})


useGeographic();
let response=await fetch("https://raw.githubusercontent.com/mmcloughlin/starbucks/master/locations.json")
let json=await response.json();
const starbucksLayer=CreateStarbucksLocationsLayer(json)
const countries=getCountries(json)

//map
new Map({
  target: 'map-container',
  layers: [
    basicLayer,countriesLayer,starbucksLayer
  ],
  view: myView
});



var select = document.getElementById("selectCountry"); 

for(var i = 0; i < countries.length; i++) {
    var country = countries[i];
    console.log(country)
    var element = document.createElement("option");
    element.text = country;
    element.value = country;
    select.add(element);
}

}

function CreateStarbucksLocationsLayer(json){
    
    let features=[]
   //create feature for each starbucks location
    for (let i = 0; i < json.length; i++) {
        let longitude=json[i].longitude
        let latitude=json[i].latitude
        let place=[longitude,latitude]
        let point= new Point(place);
        features.push(new Feature(point))
      }
  
      var starbucksLocations=new VectorLayer({
        source: new VectorSource({
          features: features,
        }),
        style: new Style({
          image: new Circle({
            radius: 3,
            fill: new Fill({color: 'red'}),
          }),
        })
      })

      return starbucksLocations
}

function getCountries(json){
    let countries=new Set()
    for(let i=0;i<json.length;i++){
        countries.add(json[i].country)
    }
    return countries
}
