import { Firebot } from "firebot-custom-scripts-types";
import Authentication from './Authentication/Authentication';

interface Params {
  message: string;
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
      message: {
        type: "string",
        default: "Hello World!",
        description: "Message",
        secondaryDescription: "Enter a message here",
      },
    };
  },
  run: (runRequest) => {
    
    let auth = new Authentication("sample","userid");
    
    const { logger } = runRequest.modules;
    logger.info(auth.state.token);
    logger.info(runRequest.parameters.message);
  },
};

export default script;
