const { WebSocket } = require('ws');

const ws = new WebSocket('ws://homeassistant.local:8123/api/websocket');
let id = 1;

ws.on('open', () => {
    console.log("Connected to home assistant!");
});

ws.on('message', (message) => {
    let data = JSON.parse(message.toString());

    if(data.type === 'auth_required') {
        let outbound = {
            type: 'auth',
            access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3MWRiZmYwYzljYWE0Mjk4ODgwNDc5Mjk5ZTMzMTc4MSIsImlhdCI6MTY1ODEyNDUyOCwiZXhwIjoxOTczNDg0NTI4fQ.7_I-71fqdhyfP2d6E-7YWo77fT-9KTAsbr0-EwZgLfc'
        };

        ws.send(JSON.stringify(outbound, null, 0));
        id++;

    } else if (data.type === 'auth_ok') {
        let req = {
            id,
            type: "call_service",
            domain: "switch",
            service: "toggle",
            target: {
                entity_id: "switch.door_outlet_bottom"
            }
        }

        ws.send(JSON.stringify(req, null, 0));
        id++;
    } else {
        console.log("Received message: ", data);
    }
});