## Firebot Twitch Extension Communicator Script

The idea here is to build a script for Firebot that can communicate with Twitch Extensions.

## Example use cases:
- Commandlist in a Twitch panel
- Buttons for triggering Preset Effect Lists


---
### Starter Firebot Custom Script in Typescript

#### Setup
1. Clone this repo.
2. `npm install`
3. Start development in your favoured editor.

#### Building
Dev:
1. `npm run build:dev`
- Automatically copies the compiled .js to Firebot's scripts folder.

Release:
1. `npm run build`
- Copy .js from `/dist`

#### Note
- Keep the script definition object (that contains the `run`, `getScriptManifest`, and `getDefaultParameters` funcs) in the `index.ts` file as it's important those function names don't get minimized.
- Edit the `"scriptOutputName"` property in `package.json` to change the filename of the outputted script.
