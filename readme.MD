# Castlevania fangame
This a fangame/remake of the first Castlevania on nes made for learning purposes, where you controls Richter instead of Simon

The graphics don't follows the nes's limits and color palette, but stay minimalist with a  32 color palette.(DB32)

I tried to improve the game with some others castlevania's mechanics like stairs's jumping and backflip. 

## Utilisation

Commande | Role
--- | --- 
`npm start` | Launches the dev server
`npm run build` | Build the ts files and copy the contents of the public folder to the build folder
`npm run check` | Compiles ts files and reports errors
`npm run create-dist-desktop` | Creates executables from the build folder (win64, linux64, osx64) with nw.js
`npm run create-dist-mobile` | Create a cordova project for android
`npm run android` | Build the project for android and launch the emulator (or mobile if connected via usb)
`start:browser` | Build the project for android and launch the browser

## Debugger

This project works with the vscode debugger, however it is necessary to configure url and webRoot
    
```
    {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8000", /** adapt to your port number */
            "webRoot": "${workspaceFolder}/template-esbuild-jsdoc" /** <-- insert folder name  */
        }
    }
```
