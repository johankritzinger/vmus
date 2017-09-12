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

}
