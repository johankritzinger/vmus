// see https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from '../../providers/providers'

// import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition } from '@ionic-native/google-maps';

// Not needed because npm install @types/google-maps --save
declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public location: Location) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
    console.log('getting location');
    this.location.startTracking();

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(this.location.lat, this.location.lng);
      // console.log('Lat = '+ position.coords.latitude + ', Long = ' + position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      console.log('map loaded')

    }, (err) => {
      console.log('map error: ' + err.message);
    });

  }
}
