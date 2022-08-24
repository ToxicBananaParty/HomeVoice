import { HAClient } from "./HAClient";
import { VoiceAssistant } from "./VoiceAssistant";

const PORCUPINE_PATH = "../models/wingdings_wake_word.ppn";
const RHINO_PATH = "../models/maywood_living_room_intents.rhn";

HAClient.start();
VoiceAssistant.start(PORCUPINE_PATH, RHINO_PATH);