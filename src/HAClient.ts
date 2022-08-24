import { WebSocket } from "ws";

export abstract class HAClient {
    private static readonly ACCESSTOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3MWRiZmYwYzljYWE0Mjk4ODgwNDc5Mjk5ZTMzMTc4MSIsImlhdCI6MTY1ODEyNDUyOCwiZXhwIjoxOTczNDg0NTI4fQ.7_I-71fqdhyfP2d6E-7YWo77fT-9KTAsbr0-EwZgLfc';
    private static readonly URI = 'ws://homeassistant.local:8123/api/websocket';

    public static connected = false;
    private static ws: WebSocket;
    private static id = 1;

    public static start() {
        this.ws = new WebSocket(this.URI);
        this.ws.on('message', this.authenticate.bind(this));
    }

    private static authenticate(data: any) {
        const req = JSON.parse(data.toString());

        if(req.type === 'auth_required') {
            let res = { type: 'auth', access_token: this.ACCESSTOKEN };
            this.sendMessage(res);
        } else if (req.type === 'auth_ok') {
            this.connected = true;
            this.ws.off('message', this.authenticate.bind(this));
            this.ws.on('message', this.parseRequest.bind(this));
        }
    }

    private static parseRequest(data: any) {
        const req = JSON.parse(data.toString());

        console.log("Received message from HA: ", req);
    }

    private static sendMessage(msg: any) {
        this.ws.send(JSON.stringify(msg, null, 0));
    }
}