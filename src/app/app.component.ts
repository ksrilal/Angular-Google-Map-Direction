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
  duration: number = 0;
  durationText: any;
  tempLocationList = [];
  public waypoints = [];
  markers = [];
  lat = 6.9271;
  lng = 79.8612; 
  selectedMarker: any; 
  public avoidHighways: boolean = true // default: false
  public provideRouteAlternatives: boolean = true // default: false

  public renderOptions = {
    suppressMarkers: true,
  }

  public markerOptions = {
    origin: {
      icon: '../assets/map_icon/map3.png',
      draggable: false,
    },
    waypoints: {
      icon: '../assets/map_icon/map1.png',
      opacity: 0.8,
    },
    destination: {
        icon: '../assets/map_icon/map1.png',
        opacity: 0.8,
    },
  }

  dbLocationsList = [    
    // { lat: 6.9044, lng: 79.8540 }, //bambalapitiya
    // {lat: 6.897558259656697, lng: 79.86007655452623}, //thunmulla
    // { lat: 6.9117, lng: 79.8646 }, //Cinnamon Gardens
    { lat: 6.8976, lng: 79.8815 }, //narahenpita
    // {lat: 6.881978742791475, lng: 79.85887818038464}, //scienter
    // { lat: 6.8741, lng: 79.8605 }, //Wellawatte 
    { lat: 6.9094, lng: 79.8943 }, //Rajagiriya
  ]; 


  ngOnInit() {
    this.getDirection();  
  }

  getDirection() {
    this.calculateDistance();
    this.origin = { lat: 6.908716852475053, lng: 79.87734690661742}; //borella (origin)
    this.destination = this.tempLocationList[this.tempLocationList.length-1];
  }
   
  calculateDistance() {
    var service = new google.maps.DirectionsService();
    this.tempLocationList.push({ lat: 6.908716852475053, lng: 79.87734690661742}); //borella (origin)
    const distanceList: number[] = [];

      while(this.dbLocationsList.length != 0){
        
        this.dbLocationsList.forEach(element => {
          const from = new google.maps.LatLng(this.tempLocationList[this.tempLocationList.length-1]);
          const to = new google.maps.LatLng(element.lat, element.lng);
          let distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
          distanceList.push(distance);
        });

        this.minDestinationIndex = distanceList.indexOf(Math.min(...distanceList));
        this.tempLocationList.push(this.dbLocationsList[this.minDestinationIndex]);
        this.dbLocationsList = this.dbLocationsList.filter(item => item !== this.dbLocationsList[this.minDestinationIndex]);
        distanceList.splice(0,distanceList.length);

        service.route({
          origin: this.tempLocationList[this.tempLocationList.length-2],
          destination: this.tempLocationList[this.tempLocationList.length-1],
          travelMode: google.maps.TravelMode.DRIVING ,
          avoidHighways: true,
          avoidTolls: true,
        }, (data, status) => {
          if (status === 'OK') {
            this.duration += data.routes[0].legs[0].duration.value;
            this.durationText = new Date(this.duration * 1000).toISOString().substr(11, 8) 
          } else {
             console.log("your error")
          }
        });

      }
    
      for(let i= 0; i< this.tempLocationList.length; i++){
        if(i==this.tempLocationList.length-1 && i==0) continue; //remove origin & destination
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
