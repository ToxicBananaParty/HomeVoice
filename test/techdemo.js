const { Picovoice } = require('@picovoice/picovoice-node');
const recorder = require('node-record-lpcm16');
const HomeAssistant = require('homeassistant');

const ACCES_KEY = 'OhKTgHETBWMBaWfC4ORc7O2mzanqdDGYThxSvPMblNpT8cDNXQuzDQ==';
const porcupinePath = './models/wingdings_wake_word.ppn';
const rhinoPath = './models/maywood_living_room_intents.rhn';

const homeass = new HomeAssistant({
    host: 'http://homeassistant.local',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3MWRiZmYwYzljYWE0Mjk4ODgwNDc5Mjk5ZTMzMTc4MSIsImlhdCI6MTY1ODEyNDUyOCwiZXhwIjoxOTczNDg0NTI4fQ.7_I-71fqdhyfP2d6E-7YWo77fT-9KTAsbr0-EwZgLfc'
});

const keywordCallback = (keyword) => {
    console.log("Detected keyword, awaiting command...");
};

const inferenceCallback = (inference) => {
    //console.log("Inference: ", JSON.stringify(inference, null, 2));
    if(inference.isUnderstood) {
        switch(inference.intent) {
            case "tvlight":
                console.log("Toggling TV Light...\n");
                homeass.services.call('toggle', 'switch', 'tv_outlet_bottom').catch(err => console.error(err));
                break;
            case "doorlight":
                console.log("Toggling Door Light...\n");
                homeass.services.call('toggle', 'switch', 'door_outlet_bottom').catch(err => console.error(err));
                break;
        }
    } else {
        console.log("Did not understand command, back to sleep...\n");
    }
};

const myPicovoice = new Picovoice(ACCES_KEY, porcupinePath, keywordCallback, rhinoPath, inferenceCallback);
const frameLength = myPicovoice.frameLength;
const sampleRate = myPicovoice.sampleRate;

const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, index) =>
    array.slice(index * size, index * size + size)
    );
};

const recording = recorder.record({
    sampleRate,
    channels: 1,
    audioType: "raw",
    recorder: "sox"
});

let frameAccumulator = [];
recording.stream().on('data', (data) => {
    let newFrames16 = new Array(data.length / 2);
    for (let i = 0; i < data.length; i += 2) {
        newFrames16[i / 2] = data.readInt16LE(i);
    }
    // Split the incoming PCM integer data into arrays of size Porcupine.frameLength. If there's insufficient frames, or a remainder,
    // store it in 'frameAccumulator' for the next iteration, so that we don't miss any audio data
    frameAccumulator = frameAccumulator.concat(newFrames16);
    let frames = chunkArray(frameAccumulator, frameLength);
    
    if (frames[frames.length - 1].length !== frameLength) {
        // store remainder from divisions of frameLength
        frameAccumulator = frames.pop();
    } else {
        frameAccumulator = [];
    }
    
    for (const frame of frames) {
        let index = myPicovoice.process(frame);
        //if (index !== -1) {
          //  console.log(`Detected 'WINGDINGS'`);
        //}
    }
});