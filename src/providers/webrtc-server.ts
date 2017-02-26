//  本地用户列表更新服务 用于维护本地用户列表
import { Injectable } from '@angular/core';
import { User } from './user';
import { SocketService } from './socket-server';
import { Data } from './datatype'
import { EventEmitter } from '@angular/core';



@Injectable()
export class WebrtcService {
    private rtcEmitter: EventEmitter<any>;
    private iceServer = {
        "iceServers": [
            { "url": "stun:hk.airir.com" },
            {
                "url": "turn:hk.airir.com",
                "username": "123",
                "credential": "123"
            }]
    };
    private pclist = new Map<string, any>();
    constructor(private socket: SocketService) {
        this.rtcEmitter = this.socket.rtcEmitter.subscribe((data: Data) => {
            // console.log('收到数据包', data);
            if (data.type === 'desc') {
                this.setdesc(data);
                return;
            }
            if (data.type === 'candidate') {
                this.setcandidate(data.data, this.pclist.get(data.key));
                return;
            }
        });
    }
    async   init(mediaOptions: any, who_id: string, youareoffer: boolean): Promise<any> {
        let data = new Data('ok', true);
        let pc: any = new (<any>window).RTCPeerConnection(this.iceServer);
        this.pclist.set(who_id, pc);
        pc.onicecandidate = (evt: any) => {
            // console.log('获取candidate');
            if (evt.candidate) {
                let tmp = new Data('candidate', evt.candidate)
                if (youareoffer) {
                    tmp.id_answer = who_id;
                    tmp.id_offer = this.socket.socket.id;
                } else {
                    tmp.id_offer = who_id;
                    tmp.id_answer = this.socket.socket.id;
                }
                this.socket.emit(new Data('candidate', evt.candidate));
                // console.log('send icecandidate');
            };
        };
        if (youareoffer) {
            pc.createOffer().then(
                (desc: any) => {
                    console.log('createOffer成功');
                    pc.setLocalDescription(desc).then(
                        () => {
                            console.log('设置本地desc成功', desc);
                            let tmp = new Data('desc', desc)
                            tmp.id_answer = who_id;
                            tmp.id_offer = this.socket.socket.id;
                            tmp.from_offer = true;
                            this.socket.emit(tmp);
                        },
                        (err: any) => {
                            console.log('setLocalDesc错误', err);
                        }
                    );
                },
                (err: any) => {
                    console.log('createOffer错误', err);
                }
            );
        }
        return new Promise(resolve => {
            console.log('获取本地流');
            if (!navigator.getUserMedia) {
                navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
            }
            if (!navigator.getUserMedia) {
                console.log('getUserMedia not supported in this browser.');
                resolve(new Data('getUserMediaErr', false));
            }

            navigator.getUserMedia(mediaOptions,
                stream => data.stream_l = stream
                , e => console.log(e));

            pc.addStream(data.stream_l);
            pc.onaddstream = (e: any) => {
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx绑定远端流');
                // this.remoteVideo.nativeElement.src = URL.createObjectURL(e.stream);
                data.stream_r = e.stream
                resolve(data)
            };
        });




    }






    public setStream(mediaOptions: any): Promise<any> {
        return new Promise(resolve => {
            console.log('获取本地流');
            if (!navigator.getUserMedia) {
                navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
            }
            if (!navigator.getUserMedia) {
                console.log('getUserMedia not supported in this browser.');
                resolve(false);
            }
            navigator.getUserMedia(mediaOptions,
                stream => resolve(stream)
                , e => console.log(e));
        });
    }


    public peerconnection(stream: any): Promise<any> {
        return new Promise(resolve => {

        });
    }


    public setdesc(data: Data) {
        console.log('收到desc', data);
        let pc: any
        if (data.from_offer) {
            pc = this.pclist.get(data.id_answer);
        } else {
            pc = this.pclist.get(data.id_offer);
        }
        pc.setRemoteDescription(new (<any>window).RTCSessionDescription(data.data)).then(
            () => {
                console.log('设置远端desc成功');
                if (data.from_offer) {
                    pc.createAnswer().then(
                        (desc: any) => {
                            console.log('createAnswer成功');
                            pc.setLocalDescription(desc).then(
                                () => {
                                    console.log('设置本地desc成功');
                                    data.from_offer = false;
                                    data.data = desc;
                                    this.socket.emit(data);
                                },
                                (err: any) => console.log('setLocalDesc错误', err));
                        },
                        (err: any) => console.log('createAnswer错误', err));
                } else { };
            },
            (err: any) => console.log('setRemoteDesc错误', err));
    }

    public setcandidate(candidate: any, pc: any) {
        pc.addIceCandidate(candidate).then(
            function () {
                // console.log('收到candidate', candidate);
            },
            function (err: any) {
                console.log(err);
                console.log(candidate);
            });
    }
}

