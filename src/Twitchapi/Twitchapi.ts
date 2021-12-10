import { RunRequest } from "firebot-custom-scripts-types";
import { CommandDefinition } from "firebot-custom-scripts-types/types/modules/command-manager";
import fetch from "node-fetch";
import * as jwt from 'jsonwebtoken';
type CommandWithDescription = CommandDefinition & { description: string }

export async function getEndPoint(key:string,client_id: string, broadcaster_id: string, runRequest: RunRequest<{ client_Id: string; }>, localData: any ) {
    let data;
    let localCommands: commands[] = [];
    try {
        runRequest.modules.logger.warn(client_id);
        const token = generateHS256Token(role.external, broadcaster_id,key, runRequest);
        runRequest.modules.logger.warn(token);
        const response = await fetch('https://api.twitch.tv/helix/extensions/configurations?extension_id=' + client_id + '&segment=' + segment.broadcaster + '&broadcaster_id=' + broadcaster_id, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Client-Id': client_id
            }
        });
        data = await response.json();
    } catch (error) {
        runRequest.modules.logger.error(error);
    }

    runRequest.modules.logger.warn("external");
    runRequest.modules.logger.warn(data);
    let receivedCommands = [];
    let content: content[] = [];
    data.data.forEach((d: responceSegment) => {
        content = JSON.parse(d.content);
        content.forEach((command: content) => receivedCommands.push(command))
    })

    const arrayOfCustomCommands = Object.keys(localData.customCommands).map((guid) => {
        return localData.customCommands[guid] as CommandWithDescription;
    });

    arrayOfCustomCommands.forEach(command => {
        if (command.active && !command.hidden) {
            var commandTemp: commands = {
                c: command.trigger,
                d: command.description ?? ""
            };
            localCommands.push(commandTemp);
        }
    });

    data.data[0].content = JSON.stringify(localCommands)
    data.data[0].extension_id = client_id;
    runRequest.modules.logger.info(JSON.stringify(putEndPoint(key,client_id, runRequest.firebot.accounts.streamer.userId, data.data[0], runRequest).toString()));
    return data;
}

export async function putEndPoint(key:string,client_id: string, broadcaster_id: string, body: commands[], runRequest: RunRequest<{client_Id: string;}>) {
    let data;
    try {
        const token = generateHS256Token(role.external, broadcaster_id, key, runRequest);
        runRequest.modules.logger.warn(JSON.stringify(body));
        const response = await fetch('https://api.twitch.tv/helix/extensions/configurations', {
            method: 'put',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Client-Id': client_id
            }
        });
        data = await response.json();
    } catch (error) {
        runRequest.modules.logger.error(error);

        
    }
    return data;
}

export function generateHS256Token(role: role | undefined, user_id: string | undefined, key:string, runRequest: RunRequest<{client_Id: string;}>,) {
    const secret = Buffer.from(key, 'base64');
    var date = new Date();
    const expreiationDate = date.getTime() + 30 * 24 * 60 * 60;
    const tokenPayload: Payload = {
        exp: expreiationDate,
        role: role,
        user_id: user_id
    };

    runRequest.modules.logger.info(JSON.stringify(tokenPayload));
    try {
        const signedToken = jwt.sign(tokenPayload, secret);
        runRequest.modules.logger.info(signedToken + "token should here");
        return signedToken
    } catch (error) {
        runRequest.modules.logger.error(error);
    }
}

export type Payload = {
    exp: number | undefined;
    role: role | undefined;
    user_id: string | undefined;
};

export type pubsub_perms = {
    listen: string[] | undefined;
    send: string[] | undefined;
};

export type commands = {
    c: string | undefined;
    d: string;
};

export type content = {
    c: string | undefined;
    d: string | undefined;
    date: Date | undefined;
};

export type responceSegment = {
    extension_id: string | undefined;
    broadcaster_id: number | undefined;
    segment: segment | undefined;
    version: number | undefined;
    content: string | undefined;
};

export type responceData = {
    data: responceSegment[] | undefined;
};

export enum role {
    broadcaster = "brodcaster",
    external = "external",
    viewer = "viewer",
    moderator = "moderator",
};

export enum segment {
    global = "global",
    developer = "developer",
    broadcaster = "broadcaster",
};

