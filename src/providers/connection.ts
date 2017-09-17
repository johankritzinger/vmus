// see https://ionicframework.com/docs/native/network/
// ionic cordova plugin add cordova-plugin-network-information
// npm install --save @ionic-native/network

import { Injectable, NgZone } from '@angular/core';
import { Network } from '@ionic-native/network';

@Injectable()
export class Connection {

  public connected: boolean = false;
  public connectionType: string = 'none'

  constructor(private network: Network) {

      this.network.onDisconnect().subscribe(() => {
          console.log('network was disconnected :-(');
          this.connected = false;
          this.connectionType = 'none'
      });

    // stop disconnect watch
    // disconnectSubscription.unsubscribe();


    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.connected = true;
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.connectionType = this.network.type;
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }

      }, 3000);
    });

  }


}
