import { Firebot } from "firebot-custom-scripts-types";
import { readFileSync } from "fs";
import * as twitchAPI from "./TWitchapi/twitchAPI";
const path = require("path");


interface Params {
  client_Id: string;
  key:string;
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
      client_Id: {
        type: "string",
        default: "",
        description: "Client_ID",
      }, 
      key: {
        type: "string",
        default: "",
        description: "key",
      },
    };
  },
  run: (runRequest) => {
    const { logger } = runRequest.modules;
    const firebotCommandsPath = path.join(getFirebotChatFolderPath(), "commands.json");

    try {
      const content = readFileSync(firebotCommandsPath, { encoding: "utf-8" })
      var data = JSON.parse(content);
      if (
        data == null
      ) {
        throw new Error("Unable to read commands list");
      }
      twitchAPI.getEndPoint(runRequest.parameters.key,runRequest.parameters.client_Id, runRequest.firebot.accounts.streamer.userId, runRequest, data);
    } catch (error) {
      logger.error(error);
    }
  },
};

function getFirebotChatFolderPath() {
  let appDataFolderPath;
  if (process.platform === "win32") {
    appDataFolderPath = process.env.APPDATA;
  } else if (process.platform === "darwin") {
    appDataFolderPath = path.join(
      process.env.HOME,
      "/Library/Application Support"
    );
  } else {
    throw new Error("Unsupported OS!");
  }

  const firebotDataFolderPath = path.join(appDataFolderPath, "Firebot", "v5");
  const firebotGlobalSettingsPath = path.join(
    firebotDataFolderPath,
    "global-settings.json"
  );

  var chatFolderPath: string;
  var firebotGlobalSettings: any;
  var activeProfile: any;
  const content = readFileSync(firebotGlobalSettingsPath, { encoding: "utf-8" })
  var data = JSON.parse(content);
  firebotGlobalSettings = data;
  if (firebotGlobalSettings == null || firebotGlobalSettings.profiles == null || firebotGlobalSettings.profiles.loggedInProfile == null) {
    throw new Error("Unable to determine active profile");
  }
  activeProfile = firebotGlobalSettings.profiles.loggedInProfile;
  chatFolderPath = path.join(firebotDataFolderPath, 'profiles', activeProfile, 'chat').toString();
  return chatFolderPath;
};

export default script;