import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { RtcComponent } from '../pages/rtccom/rtccom.component';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';

@Component({ selector: 'gameroom', templateUrl: 'gameroom.html' })
export class GameRoom {
    private ok = false;
    private ttt = 0;
    test() {
        this.ok = true;
    }


    constructor(private s: SocketService) {
        setInterval(() => {
            // this.myvalue = this.soundMeter.instant;
            this.ttt++;
            console.log(this.ttt);
        }, 1000);
    }
}
