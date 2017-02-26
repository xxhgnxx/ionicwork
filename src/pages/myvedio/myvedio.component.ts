import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/datatype'
import { EventEmitter } from '@angular/core';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';
import { WebrtcService } from '../../providers/webrtc-server';

@Component({ selector: 'myvedio', templateUrl: 'myvedio.component.html' })
export class MyvedioComponent {
  private video_l = document.querySelector('#localVideo');
  private video_r = document.querySelector('#remotelVideo');
  private caller: string;
  private videcall: any;
  constructor(
    public socket: SocketService, public rtc: WebrtcService, public userData: UserData, public userService: UserService
  ) {
    this.videcall = this.socket.videcall.subscribe((data: Data) => {
      this.caller = data.data;
    });
  }

  async call(user: any) {
    let res = await this.socket.call(user.socketId);
    if (res) {
      console.log('对方同意');
      let data = await this.rtc.init({ audio: true, video: true }, user.socketId, true);
      (<any>this.video_l).src = window.URL.createObjectURL(data.stream_l);
      (<any>this.video_r).src = window.URL.createObjectURL(data.stream_r);
    } else {
      console.log('对方拒绝');
    }
  }

  async answer(res: boolean) {
    this.socket.answer(res);
    if (res) {
      console.log('同意对方');
      let data = await this.rtc.init({ audio: true, video: true }, this.caller, false);
      (<any>this.video_l).src = window.URL.createObjectURL(data.stream_l);
      (<any>this.video_r).src = window.URL.createObjectURL(data.stream_r);
    } else {
      console.log('拒绝对方');

    }

  }
  no() { }



}


