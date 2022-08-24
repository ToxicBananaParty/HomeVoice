import { Picovoice } from "@picovoice/picovoice-node/dist/types";
import { RhinoInference } from "@picovoice/rhino-node";
import recorder from "node-record-lpcm16";

export abstract class VoiceAssistant {
    private static readonly PICOKEY = 'OhKTgHETBWMBaWfC4ORc7O2mzanqdDGYThxSvPMblNpT8cDNXQuzDQ==';
    private static readonly DIR = '../models/';

    private static picovoice: Picovoice;

    public static start(porcupinePath: string, rhinoPath: string) {
        this.picovoice = new Picovoice(this.PICOKEY, porcupinePath, this.onWake.bind(this), rhinoPath, this.onRhino.bind(this));
    }

    private static onWake(keyword: string) {
        console.log("Detected keyword, listening for command...");
    }

    private static onRhino(inference: RhinoInference) {
        if(inference.isUnderstood) {
            
        } else {
            console.log("Did not understand command, back to sleep...\n");
        }
    }
}