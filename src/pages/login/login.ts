import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {NavController} from 'ionic-angular';

import {SignupPage} from '../signup/signup';
import {TabsPage} from '../tabs/tabs';
import {UserData} from '../../providers/user-data';
import {UserService} from '../../providers/user-server';
import {SocketService} from '../../providers/socket-server';

@Component({selector: 'page-user', templateUrl: 'login.html'})
export class LoginPage {
  login : {
    username?: string,
    password?: string
  } = {};
  submitted = false;

  constructor(public navCtrl : NavController, public socketService : SocketService, public userData : UserData, public userService : UserService) {}

  onLogin(form : NgForm) {
    this.submitted = true;

    if (form.valid) {
      this
          .tologin(this.login.username, this.login.password);

    }
  }

  async tologin(name : string, password : string) {
    this.submitted = true;

    let logined = await this.socketService.login(name, password);

    if (logined) {

    this
        .navCtrl
        .push(TabsPage);
 
     } else {
      console.log("登陆失败");
    this.submitted = false;
      
    }
  }

  onSignup() {
    this
      .navCtrl
      .push(SignupPage);
  }
}
