import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})  
export class AppComponent {
  origin: any;
  destination: any;
  minDestinationIndex: any;
  duration: any;

  lat = 6.9271;
  lng = 79.8612; 

  selectedMarker: any; 
  //travelMode = google.maps.TravelMode.BICYCLING;
  //public transitOptions: string = 'TRANSIT';
  public avoidHighways: boolean = true // default: false
  public provideRouteAlternatives: boolean = true // default: false

  public renderOptions = {
    suppressMarkers: true,
  }

  public markerOptions = {
    origin: {
      //infoWindow: 'This is origin.',
      icon: '../assets/map_icon/map3.png',
      draggable: false,
    },
    waypoints: {
      icon: '../assets/map_icon/map1.png',
      //label: 'marker label',
      opacity: 0.8,
    },
    destination: {
        icon: '../assets/map_icon/map1.png',
        //label: 'marker label',
        opacity: 0.8,
    },
  }

  markers = [];

  dbLocationsList = [    
    // { lat: 6.9044, lng: 79.8540 }, //bambalapitiya
    {lat: 6.897558259656697, lng: 79.86007655452623}, //thunmulla
    //{ lat: 6.9117, lng: 79.8646 }, //Cinnamon Gardens
    //{ lat: 6.8976, lng: 79.8815 }, //narahenpita
    {lat: 6.881978742791475, lng: 79.85887818038464}, //scienter
    { lat: 6.8741, lng: 79.8605 }, //Wellawatte 
    //{ lat: 6.9094, lng: 79.8943 }, //Rajagiriya
  ]; 

  tempLocationList = [];

  public waypoints = []

  ngOnInit() {
    this.getDirection();
    var service = new google.maps.DirectionsService();
     service.route({
      origin: { lat: 6.908716852475053, lng: 79.87734690661742},
      destination: this.tempLocationList[this.tempLocationList.length-1],
      travelMode: google.maps.TravelMode.DRIVING ,
      avoidHighways: true,
      avoidTolls: true,
    }, (data, status) => {
      if (status === 'OK') {
        this.duration = data.routes[0].legs[0].duration.text;
      } else {
         console.log("your error")
      }
    });
  }

  getDirection() {
    this.calculateDistance();
    this.origin = { lat: 6.908716852475053, lng: 79.87734690661742}; //borella
    this.destination = this.tempLocationList[this.tempLocationList.length-1];
  }
  
  calculateDistance() {
    this.tempLocationList.push({ lat: 6.908716852475053, lng: 79.87734690661742});
    const distanceList: number[] = [];
    while(true){
      this.dbLocationsList.forEach(element => {
        const from = new google.maps.LatLng(this.tempLocationList[this.tempLocationList.length-1]);
        const to = new google.maps.LatLng(element.lat, element.lng);
        let distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
        distanceList.push(distance);
      });
      this.minDestinationIndex = distanceList.indexOf(Math.min(...distanceList));
      this.tempLocationList.push(this.dbLocationsList[this.minDestinationIndex]);
      this.dbLocationsList = this.dbLocationsList.filter(item => item !== this.dbLocationsList[this.minDestinationIndex]);
      distanceList.splice(0,distanceList.length)
      if(this.dbLocationsList.length == 0)  break;
    }

    for(let i= 0; i< this.tempLocationList.length; i++){
      if(i==this.tempLocationList.length-1 && i==0) continue;
      else{
        this.waypoints.push({
          location: this.tempLocationList[i],
          stopover: false,
        })
      }
    }
  } 

  onMapReady(mapInstance) {
    let trafficLayer = new google.maps.TrafficLayer();
    let bicyclingLayer = new google.maps.BicyclingLayer();
    trafficLayer.setMap(mapInstance);
    bicyclingLayer.setMap(mapInstance);
  }

}   
