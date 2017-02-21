/**
 * User
 */
export class User {
    public password: string;
    public color: string;
    public role: string;
    public userID: string;
    public head: string;
    public socketid: string;
    constructor(public name: string) { }
}

/**
 * Act
 */
export class Act {
    constructor(public act_name: string) { }
}

/**
 * Data
 */
export class Data {
    id: number;
    key: string;
    name: string;
    password: string;
    constructor(public type: string, public data: any) { }
}

/**
 * 随机字符串
 */
// tslint:disable-next-line:no-unused-variable
export function idgen(): string {
    const _printable: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 22; i++) {
        text += _printable.charAt(Math.floor(Math.random() * _printable.length));
    }
    return text;
}
