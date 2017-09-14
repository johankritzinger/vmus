// See https://www.joshmorony.com/adding-background-geolocation-to-an-ionic-2-application/

import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/filter';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Injectable()
export class Location {
  // private position: any;

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public accuracy: number = 10000;
  public altitude: number = 0;
  public altitudeAccuracy: number = 10000;


  constructor(public zone: NgZone, public geolocation: Geolocation ) {

  }

  startTracking() {
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.accuracy = position.coords.accuracy;
        this.altitude = position.coords.altitude;
        this.altitudeAccuracy = position.coords.altitudeAccuracy;

      });

    });


  }

  stopTracking() {

  console.log('stopTracking');

  this.watch.unsubscribe();

}

  getLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
    // let this.position=position {
          alert('Latitude: '          + position.coords.latitude          + '\n' +
                'Longitude: '         + position.coords.longitude         + '\n' +
                'Altitude: '          + position.coords.altitude          + '\n' +
                'Accuracy: '          + position.coords.accuracy          + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                'Heading: '           + position.coords.heading           + '\n' +
                'Speed: '             + position.coords.speed             + '\n' +
                'Timestamp: '         + position.timestamp                + '\n');
      }, (err) => {
        console.log('map error: ' + err.message);
      });


  }

  updateLocNames() {
    // section from http://www.baboonspideratlas.co.za/templates/yoo_lava/js/uploadform.js
    // //uses geonames service
    // //get the locality and country
    // $.ajax({
    //   type: "GET",
    //   url: "http://api.geonames.org/findNearbyJSON?lat=" + lat + " &lng= " + long +  "&username=iane&localCountry=true",
    //   dataType: "json",
    // timeout: 5000	//5seconds
    // }).done(function(data) {
    //
    //   if (data.geonames.length == 0){
    //     $('#locality').val(null);
    //     $('#country').val(null);
    //     $('#admin1').val(null);
    //   }
    //
    //   else {
    // //get the variables needed to construct the locality name
    // var dist = parseFloat(data.geonames[0].distance);
    // var dir = getDir(data.geonames[0].lat, data.geonames[0].lng, lat, long); //gives the direction from the town to the locality, so lat1 and lat2 are coords of the town
    // var loctype = data.geonames[0]['fcodeName'];
    // var loc = data.geonames[0]['name'];
    // var locstr = "";
    //
    // //construct the locality name
    // if (loctype == "farm")
    // locstr = loctype.charAt(0).toUpperCase() + loctype.slice(1) + " " + loc;
    // else if ((loctype == "hill" || loctype == "mountain") && loc.search("berg") == -1 && loc.search("kop") == -1 && loc.search("monte"))
    // locstr = data.geonames[0]['name'] + " " + loctype;
    // else if (loctype == "railroad siding")
    // locstr = data.geonames[0]['name'] + " siding";
    // else
    // locstr = data.geonames[0]['name'];
    //
    //
    //     if(dist > 5){
    //       dist = Math.round(dist);
    //       locstr += ", " + dist + "km " + dir;
    //     }
    //     else if(dist > 2) {
    //       dist = dist.toFixed(1);
    //       locstr += ", " + dist + "km " + dir;
    //     }
    // $('#localityspinner').addClass("uk-hidden");
    // $('#locality').val(locstr);
    //     $('#countryspinner').addClass("uk-hidden");
    // $('#country').val(data.geonames[0]['countryName']);
    //     $('#admin1').val(data.geonames[0]['adminName1']);
    //   }
    // }).fail(function(){
    // $('#countryspinner').addClass("uk-hidden");
    // $('#localityspinner').addClass("uk-hidden");
    // UIkit.modal.alert("Failed to get locality data. This may be due to a slow internet connection. Please enter the locality data manually, or check your internet connection");
    // }); //end ajax for locality
    //
    // //get the nearest town
    // $.ajax({
    //   type: "GET",
    //   url: "http://api.geonames.org/findNearbyPlaceNameJSON?lat=" + lat + " &lng= " + long +  "&username=iane&localCountry=true&radius=300&cities=cities1000",
    //   dataType: "json",
    // timeout: 5000	//5seconds
    // }).done(function(data) {
    //
    //   if (data.geonames.length == 0){
    // $('#nearesttown').val(null);
    // $('#nearesttownspinner').addClass("uk-hidden");
    // }
    //
    //   else {
    //     var dist = parseFloat(data.geonames[0].distance);
    //     if (dist > 15)
    //       dist = Math.round(dist);
    //     else
    //       dist = dist.toFixed(1);
    //     var dir = getDir(data.geonames[0].lat, data.geonames[0].lng, lat, long); //gives the direction from the town to the locality, so lat1 and lat2 are coords of the town
    //     var townstr = data.geonames[0]['name']; //needs ['name'] to avoid conflict
    //     if(dist > 0.0)
    //       townstr += ", " + dist + "km " + dir;
    // $('#nearesttownspinner').addClass("uk-hidden");
    // $('#nearesttown').val(townstr);
    //  }
    // });
    //
    // } //end updatelocs

  }

}
