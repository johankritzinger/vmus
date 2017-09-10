// See https://www.joshmorony.com/adding-background-geolocation-to-an-ionic-2-application/

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from '@ionic-native/geolocation';

import { Api } from './api';

import { Item } from '../models/item';

@Injectable()
export class Location {
  // private position: any;

  constructor(public geolocation: Geolocation) {
      this.geolocation.getCurrentPosition()
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
