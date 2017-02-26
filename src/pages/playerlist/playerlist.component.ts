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

@Component({ selector: 'playerlist', templateUrl: 'playerlist.component.html' })
export class PlayerlistComponent {
  private iceServer = {
    "iceServers": [
      {
        // "url": "stun:stun.l.google.com:19302"
        "url": "stun:hk.airir.com"
        // "url": "stun:stunserver.org"
      },
      {
        "url": "turn:hk.airir.com",
        "username": "123",
        "credential": "123"
      }
    ]
  };


  constructor(public socketService: SocketService, public userData: UserData, public userService: UserService) {
    console.log(this.userService.hList);

  }

  public ngOnInit() {
    // 123
  };


  private setanswer() {
    // todo
  };
}
