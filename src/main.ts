import { Firebot } from "firebot-custom-scripts-types";
import Authentication from './Authentication/Authentication';

interface Params {
  streamer: string; 
  token: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "twitch communicator script",
      description: "A communicator script for twitch",
      author: "brumoen",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      streamer: {
        type: "string",
        default: "Streamer Name",
        description: "Streamer Name",
        secondaryDescription: "Enter your twitch Streamer Name here",
      },
      token: {
        type: "string",
        default: "",
        description: "Token",
        secondaryDescription:"the Private key from the extension you have created",
      },
    };
  },
  run: (runRequest) => {

    let auth = new Authentication(runRequest.parameters.token, "$userId[$streamer]");
    const { logger } = runRequest.modules;
    logger.info(auth.state.token); 
    logger.info(auth.state.opaque_id);
    logger.info(runRequest.parameters.streamer);

  },
};

export default script;
