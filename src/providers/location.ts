// See https://www.joshmorony.com/adding-background-geolocation-to-an-ionic-2-application/

import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/filter';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';

@Injectable()
export class Location {
  // private position: any;

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public accuracy: number = 10000.0;
  public altitude: number = 0;
  public altitudeAccuracy: number = 10000.0;

  private geoNames: any;
  public locstr :string = "";
  public townstr: string = '';
  public country: string = '';
  public province: string = '';

  // !!! Need to change
  geoNamesLogin: string = 'johank'


  constructor(public zone: NgZone,
    public geolocation: Geolocation,
    public events: Events,
    public http: Http ) {

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
      if (this.accuracy < 100) {
        console.log('accuracy OK, checking location');
        this.events.publish('locationFound', this.lat,this.lng, this.accuracy);
        // this.fetchlocstr (position.coords.latitude,position.coords.longitude);
        // this.fetchtownstr (position.coords.latitude,position.coords.longitude);
      }

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

  fetchlocstr (lat,long) {
    // stolen from http://www.baboonspideratlas.co.za/templates/yoo_lava/js/uploadform.js
    return new Promise(resolve => {
      this.http.get("http://api.geonames.org/findNearbyJSON?lat=" + lat + " &lng= " + long +
        "&username=" + this.geoNamesLogin + "&localCountry=true").map(res => res.json()).subscribe(data => {

          console.log('data = ' + JSON.stringify(data) );
          if (data.geonames.length > 0) {
            this.geoNames = data.geonames[0];
            var dist: number = parseFloat(data.geonames[0].distance);
            var dir = this.getDir(data.geonames[0].lat, data.geonames[0].lng, lat, long); //gives the direction from the town to the locality, so lat1 and lat2 are coords of the town
            var loctype = data.geonames[0]['fcodeName'];
            var loc = data.geonames[0]['name'];
            this.locstr = "";

            //construct the locality name
            if (loctype == "farm")
            this.locstr = loctype.charAt(0).toUpperCase() + loctype.slice(1) + " " + loc;
            else if ((loctype == "hill" || loctype == "mountain") && loc.search("berg") == -1 && loc.search("kop") == -1 && loc.search("monte"))
            this.locstr = data.geonames[0]['name'] + " " + loctype;
            else if (loctype == "railroad siding")
            this.locstr = data.geonames[0]['name'] + " siding";
            else
            this.locstr = data.geonames[0]['name'];


                if(dist > 5){
                  // dist = Math.round(dist);
                  this.locstr += ", " + Math.round(dist) + "km " + dir;
                }
                else if(dist > 2) {
                  // dist = dist.toFixed(1);
                  this.locstr += ", " + dist.toFixed(1) + "km " + dir;
                }
            this.country = data.geonames[0].countryName;
            this.province = data.geonames[0].adminName1;
            console.log('country found ' + this.country)

          }
          resolve(true);
      },
      err => {
          console.log(err);
      });
    })
  }

  fetchtownstr (lat,long) {
    // stolen from http://www.baboonspideratlas.co.za/templates/yoo_lava/js/uploadform.js
    return new Promise(resolve => {
      this.http.get("http://api.geonames.org/findNearbyPlaceNameJSON?lat=" + lat +
            " &lng= " + long +  "&username=" + this.geoNamesLogin +
            "&localCountry=true&radius=300&cities=cities1000").map(res => res.json()).subscribe(data => {
              // console.log('PlaceNamedata = ' + JSON.stringify(data) );
          if (data.geonames.length > 0) {
            // this.geoNames = data.geonames[0];
            var dist: number = parseFloat(data.geonames[0].distance);
            var dir = this.getDir(data.geonames[0].lat, data.geonames[0].lng, lat, long); //gives the direction from the town to the locality, so lat1 and lat2 are coords of the town
            this.townstr = data.geonames[0]['name']; //needs ['name'] to avoid conflict
            //construct the locality name
                if(dist > 15){
                  // dist = Math.round(dist);
                  this.townstr += ", " + Math.round(dist) + "km " + dir;
                }
                else if(dist > 2) {
                  // dist = dist.toFixed(1);
                  this.townstr += ", " + dist.toFixed(1) + "km " + dir;
                }
          }
          console.log('townstr = ' + this.townstr)
          resolve(true);
      },
      err => {
          console.log(err);
      });
    })
  }

  getDir(lat1, long1, lat2, long2){
       /*
       stolen from http://www.baboonspideratlas.co.za/templates/yoo_lava/js/uploadform.js
       formulae from http://www.movable-type.co.uk/scripts/latlong.html and
	   http://stackoverflow.com/questions/2131195/cardinal-direction-algorithm-in-java */

       var laTr1: number = lat1*(Math.PI/180);
       var loTr1: number = long1*(Math.PI/180);
       var laTr2: number = lat2*(Math.PI/180);
       var loTr2: number = long2*(Math.PI/180);
       var y: number = Math.sin(loTr2-loTr1) * Math.cos(laTr2);
       var x: number = Math.cos(laTr1)*Math.sin(laTr2) - Math.sin(laTr1)*Math.cos(laTr2)*Math.cos(loTr2-loTr1);
       var brng: number = Math.atan2(y, x)*(180/Math.PI);

       var bearings = ["NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

        var index: number = brng - 11.25;
        if (index < 0)
            index += 360;
        index = Math.round(index / 22.5);

        return(bearings[index]);

  } //end getDir

}
