# Template Esbuild Jsdoc

Ce template front utilise le bundler esbuild.

## Utilisation

Commande | Role
--- | --- 
`npm start` | Lance le serveur de dev
`npm run build` | Build les fichiers ts et copie le contenu du dossier public dans le dossier build
`npm run check` | Compile les fichiers ts et signale les erreurs
`npm run create-dist-desktop` | Crée des executables du dossier build (win64, linux64, osx64) avec nw.js
`npm run create-dist-mobile` | Crée un projet cordova pour android
`npm run android` | Build le projet pour android et lance l'emulateur (ou le mobile si connecté via usb)
`start:browser` | Build le projet pour android et lance le navigateur

## Debugger

Ce template fonctionne avec le debugger de vscode, il faut cependant bien configurer url et webRoot
    
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
