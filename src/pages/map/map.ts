// see https://www.joshmorony.com/ionic-2-how-to-use-google-maps-geolocation-video-tutorial/
import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Vmrecords, Location } from '../../providers/providers';
// import { RecordLocationPage } from '../record-location/record-location';

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
  lat: number;
  long: number;
  mapDet: any;

  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public vmrecords: Vmrecords,
    public navParams: NavParams,
    public location: Location,
    // public recordform: RecordLocationPage.form,
  ) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
    this.mapDet = this.navParams.get('mapDet');
    this.lat = this.mapDet.lat || this.location.lat;
    this.long = this.mapDet.long || this.location.lng;

    // What I want to do here is get coords from record-location.  Use normal navparams or such
    // if (this.recordLocationPage.form.value.lat) {
    //     let latLng = new google.maps.LatLng(this.recordLocationPage.form.value.lat, this.recordLocationPage.form.value.long);
    //     // console.log('Lat = '+ position.coords.latitude + ', Long = ' + position.coords.longitude);
    //     let mapOptions = {
    //       center: latLng,
    //       zoom: 15,
    //       mapTypeId: google.maps.MapTypeId.ROADMAP
    //     }
    //
    //     let marker = new google.maps.Marker({
    //       map: this.map,
    //       animation: google.maps.Animation.DROP,
    //       position: latLng
    //     });
    //
    //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //     console.log('map loaded')
    // } else {
      this.location.startTracking();

      // this.geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(this.lat, this.long);
        // console.log('Lat = '+ position.coords.latitude + ', Long = ' + position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        console.log('map loaded');

        if (this.mapDet.lat) {

          let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });
        }

      // }, (err) => {
      //   console.log('map error: ' + err.message);
      // });
    // }
  }
}
