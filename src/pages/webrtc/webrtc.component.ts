/// <reference path="D:\GitHub\ionicwork\node_modules\@types\webrtc\index.d.ts" />


import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/datatype'

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';

@Component({ selector: 'webrtc', templateUrl: 'webrtc.component.html' })
export class WebrtcComponent {
  private iceServer: any;
  private step = 0;
  private socketisonline: boolean;
  private pc: any;

  private localStream: MediaStream;

  private isanswer = true;

  @ViewChild('video') private localVideo: any;
  @ViewChild('video2') private remoteVideo: any;

  constructor(
    public socketService: SocketService, public userData: UserData, public userService: UserService
  ) { }

  public ngOnInit() {
    // 123
  };
  private async Start() {
    let ok = await this.socketService.start()
    if (ok) {
      this.step = 1;
      console.log('初始化');
      this.socketService.rtcEmitter.subscribe((data: Data) => {
        console.log('收到数据包', data);
        if (data.type === 'desc') {
          this.setdesc(data.data);
          return;
        }
        if (data.type === 'candidate') {
          this.setcandidate(data.data);
          return;
        }
      });
    } else {
      console.log('连接服务器失败');
    }
  }

  public setdesc(desc: any) {
    console.log('收到desc');
    this.pc.setRemoteDescription(desc).then(
      () => {
        console.log('设置远端desc成功');
        if (this.isanswer) {
          this.pc.createAnswer().then(
            (desc: any) => {
              console.log('createAnswer成功');
              this.pc.setLocalDescription(desc).then(
                () => {
                  console.log('设置本地desc成功');
                  this.socketService.emit(new Data('desc', desc));
                },
                (err: any) => console.log(err));
            },
            (err: any) => console.log(err));
        };
      },
      (err: any) => console.log(err));
  }


  public setcandidate(candidate: any) {
    this.pc.addIceCandidate(candidate).then(
      function () {
        console.log('收到candidate', candidate);
      },
      function (err: any) {
        console.log(err);
        console.log(candidate);
      });
  }


  private setStream() {
    this.step = 2;
    console.log('获取本地流');
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then((stream: MediaStream) => {
      console.log(stream);
      this.localStream = stream;
      this.localVideo.nativeElement.src = URL.createObjectURL(this.localStream);
    });
  }

  // private setStream() {
  //   this.step = 2;
  //   console.log('获取本地流');
  //  var mediaOptions = { audio: false, video: true };
  //   if (!navigator.getUserMedia) {
  //     navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
  //   }
  //   if (!navigator.getUserMedia) {
  //     return alert('getUserMedia not supported in this browser.');
  //   }
  //   navigator.getUserMedia(mediaOptions, success, function (e) {
  //     console.log(e);
  //   });
  //   function success(stream: any) {
  //     let video = document.querySelector('#localVideo');
  //     console.log(video);
  //     (<any>video).src = window.URL.createObjectURL(stream);
  //   }
  // }


  private peerconnection() {
    if (!this.isanswer) {
      this.step = 4;
    } else {
      this.step = 5;
    }

    this.pc = new RTCPeerConnection(this.iceServer);
    console.log(this.pc);
    this.pc.onicecandidate = (evt: any) => {
      console.log('获取candidate');
      if (evt.candidate) {
        this.socketService.emit(new Data('candidate', evt.candidate));
        console.log('send icecandidate');
      };
    };
    console.log('设置待发送stream', this.localStream);
    // this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream));
    this.pc.addStream(this.localStream);
    this.pc.onaddstream = (e: any) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx绑定远端流');
      this.remoteVideo.nativeElement.src = URL.createObjectURL(e.stream);
    };
  }

  private Call() {
    this.isanswer = false;
    this.step = 3;
  };
  private answer() {
    this.isanswer = true;
    this.step = 3;

  };

  private setoffer() {
    this.pc.createOffer().then(
      (desc: any) => {
        console.log('createOffer成功');
        this.pc.setLocalDescription(desc).then(
          () => {
            console.log('设置本地desc成功');
            this.socketService.emit(new Data('desc', desc));
          },
          (err: any) => {
            console.log(err);
          }
        );
      },
      (err: any) => {
        console.log(err);
      }
    );

  };

  private setanswer() {
    // todo
  };
}
