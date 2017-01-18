import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Data} from './datatype'
import {idgen} from './datatype'
import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Injectable()
export class SocketService {
    private socket : SocketIOClient.Socket;

    constructor(public events : Events, public storage : Storage) {}

    /**
   * 初始化过程
   */
    public start() : Promise < any > {
        if(typeof this.socket !== 'undefined' && this.socket.connected) {
            console.log('已经连接');
            return new Promise(resolve => {
                resolve(this.socket.id);
            });

        } else {

            this.socket = io.connect('192.168.1.14:81', {reconnection: false});
            // this.socket = io.connect('127.0.0.1:81', {reconnection: false}); this.socket
            // = io.connect('hk.airir.com:81', { reconnection: false });
            return new Promise(resolve => {
                let tmptimer = setTimeout(() => {
                    console.log(Date().toString().slice(15, 25), '连接服务器', '失败');
                    this
                        .socket
                        .off('ok');
                    resolve(false);
                }, 1000);

                this
                    .socket
                    .once('ok', () => {
                        console.log(Date().toString().slice(15, 25), '连接服务器', '成功', this.socket.id);
                        resolve(this.socket.id);
                        clearTimeout(tmptimer);
                    });
            });

        }
    }

    public async login(name : string, password : string) : Promise < any > {
        let started = await this.start();
        return new Promise(resolve => {
            if (started) {
                let logindata = new Data("login");
                logindata.name = name;
                logindata.password = password;
                this.send(logindata, (x : boolean) => {
                    if (x) {
                        this
                            .events
                            .publish('user:login');
                    }
                    resolve(x)
                });
            } else {
                resolve(false);
            }
        })

    }

    /**
   * 发送器，data：内容，cb：后续动作入口
   */
    public send(data : Data, cb : Function) {
        data.key = idgen();
        let tmpemit = this
            .socket
            .emit('system', data);
        let timeout = setTimeout(() => {
            tmpemit.close();
            cb(false);
        }, 2000);
        this
            .socket
            .once(data.key, () => {
                clearTimeout(timeout);
                this
                    .socket
                    .off(data.key);
                cb(true);
            });
    }

    /**
   * 消息默认cb
   */
    callbackresout(res : boolean) {
        console.log('消息反馈', res);
        if (res) {} else {
            console.log('断线!');
        }
    }

}
