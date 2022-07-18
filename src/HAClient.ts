import { WebSocket } from "ws";

export abstract class HAClient {
    private static readonly ACCESSTOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3MWRiZmYwYzljYWE0Mjk4ODgwNDc5Mjk5ZTMzMTc4MSIsImlhdCI6MTY1ODEyNDUyOCwiZXhwIjoxOTczNDg0NTI4fQ.7_I-71fqdhyfP2d6E-7YWo77fT-9KTAsbr0-EwZgLfc';
    private static readonly URI = 'ws://homeassistant.local:8123/api/websocket';

    private static ws: WebSocket;

    public static start() {
        this.ws = new WebSocket(this.URI);
        this.ws.on('message', this.messageReceived.bind(this));
    }

    private static messageReceived(data: any) {
        console.log(JSON.parse(data.toString()));
    }
}