import { Injectable } from '@angular/core';
import { SocketService } from './socket-server';

@Injectable()
export class UserService {

    constructor(public socketService:SocketService) { }


}