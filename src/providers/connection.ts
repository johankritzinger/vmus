// see https://ionicframework.com/docs/native/network/
// ionic cordova plugin add cordova-plugin-network-information
// npm install --save @ionic-native/network

import { Injectable, NgZone } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

@Injectable()
export class Connection {

  public connected: boolean = false;
  public connectionType: string = 'none'

  constructor(
      private network: Network,
      public events: Events
    ) {

      this.network.onDisconnect().subscribe(() => {
          console.log('network was disconnected :-(');
          this.connected = false;
          this.connectionType = 'none';
          this.events.publish('connectionChange',this.connected);
      });

    // stop disconnect watch
    // disconnectSubscription.unsubscribe();


    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.connected = true;
      this.events.publish('connectionChange',this.connected);
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.connectionType = this.network.type;
        this.events.publish('connectionType',this.connectionType);
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }

      }, 3000);
    });

  }


}
