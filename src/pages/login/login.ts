import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';

@Component({ selector: 'page-user', templateUrl: 'login.html' })
export class LoginPage {
  login: {
    username?: string,
    password?: string
  } = {};
  submiting = false;
  popmsg = "111";
  constructor(public navCtrl: NavController, public socketService: SocketService, public userData: UserData, public userService: UserService) {
    this.socketService.start();
  }

  onLogin(form: NgForm) {
    this.submiting = true;
    if (form.valid) {
      this.tologin(this.login.username, this.login.password);

    }
  }

  tologin(name: string, password: string) {
    this.submiting = true;
    this.socketService.login(name, password);
    this.socketService.loginResult.subscribe((result: string) => {
      this.submiting = false;
      if (result === '认证成功') {
        console.log('登陆成功');
        this.userService.myname = name;
        this.userService.isLogin = true;
        this.navCtrl.push(TabsPage);
      } else {
        if (result === '认证失败') {
          this.popmsg = this.userService.other;

        } else {
          this.popmsg = result;
        }
        setTimeout(() => this.popmsg = '', 3000);
        // this.socketsevice.disconnect();
        console.log('认证失败');
      }
    });
  }


  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
