import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Data } from './datatype'
import { idgen } from './datatype'
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;
    @Output() loginResult: EventEmitter<any> = new EventEmitter();
    constructor(public events: Events, public storage: Storage) { }

    /**
   * 初始化过程
   */
    public start(): Promise<any> {
        if (typeof this.socket !== 'undefined' && this.socket.connected) {
            console.log('已经连接');
            return new Promise(resolve => {
                resolve(this.socket.id);
            });

        } else {

            this.socket = io.connect('192.168.1.14:81', { reconnection: false });
            // this.socket = io.connect('127.0.0.1:81', {reconnection: false}); this.socket
            // = io.connect('hk.airir.com:81', { reconnection: false });
            return new Promise(resolve => {
                let tmptimer = setTimeout(() => {
                    console.log(Date().toString().slice(15, 25), '连接服务器', '失败');
                    this.socket.removeListener('ok');
                    resolve(false);
                }, 1000);
                this.socket.once('ok', () => {
                    console.log(Date().toString().slice(15, 25), '连接服务器', '成功', this.socket.id);
                    resolve(this.socket.id);
                    clearTimeout(tmptimer);
                    this.init();
                });
            });

        }
    }


    public init() {
        this.socket.on('system', (data: Data) => {
            console.log('收到数据包');
            this.system(data);
        })
    }



    public system(data: Data) {
        console.log('%csystem', 'background: #93ADAA; color: #000', data);

        // dataLoader(this.userService, this.theGameService, this.theMsgService, data);

        switch (data.type) {


            case 'loginSuccess':
                this.loginResult.emit('认证成功');
                break;

            case 'Login_fail':
                this.loginResult.emit('认证失败');
                // myEmitter.emit('user_login_passWrong');
                break;

            case 'updata':
                break;



            default:
                console.log(Date().toString().slice(15, 25), '未定义请求');


        }
    }







    public async login(name: string, password: string): Promise<any> {
        console.log(this.socket);
        let started = await this.start();
        return new Promise(resolve => {
            if (started) {
                let logindata = new Data("login");
                logindata.name = name;
                logindata.password = password;
                this.send(logindata, this.callbackresout);
                let tmptimer = setTimeout(() => {
                    console.log(this.socket);
                    this.socket.removeListener('login');
                    resolve(-2)
                }, 3000);
                this.socket.once('login', () => {
                    console.log(Date().toString().slice(15, 25), '登陆成功');
                    resolve(1);
                    clearTimeout(tmptimer);
                });
            } else {
                resolve(0);
            }
        })

    }

    /**
   * 发送器，data：内容，cb：后续动作入口
   */
    public send(data: Data, cb: Function) {
        data.key = idgen();
        let tmpemit = this.socket.emit('system', data);
        let timeout = setTimeout(() => {
            tmpemit.close();
            cb(false);
        }, 2000);
        this.socket.once(data.key, () => {
            clearTimeout(timeout);
            this.socket.off(data.key);
            cb(true);
        });
    }

    /**
    * 消息默认cb
    */
    callbackresout(res: boolean) {
        console.log('消息反馈', res);
        if (res) { } else {
            console.log('断线!');
        }
    }

}
