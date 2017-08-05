import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

export enum ConnectionStatusEnum {
    Online,
    Offline
}

@Injectable()
export class NetworkProvider {

    private previousStatus;

    constructor(private eventCtrl: Events, public network: Network) {
        this.previousStatus = ConnectionStatusEnum.Online;
    }

    public initializeNetworkEvents(): void {
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                debugger;
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                debugger;
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }
}