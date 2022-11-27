/**
 * Script which automates the import, the preload and the addition of animations, of an atlas. 
 * You must configure the script on your project first.
 * The scene receiving the changes must contain special comments.
 * 
 * @author: philippe Pereira (BlunT76)
 */

 /**
  * HOW TO
  * - Put this script at the root of project
  * - The atlas image and atlas json must have the same name
  * - Change the config below to suit your needs
  * - Inside your scene file, you must indicate where to place each section with special comments:
  * // IMPORT ATLAS //      <-- top of file
  * // PRELOAD ATLAS //     <-- in the preload section
  * // ANIMS ATLAS //       <-- in the create section
  * 
  * Start the script:
  * node ./addAtlas ./src/assets/graphics/characters/player/playerAtlas <-- url of your atlas, WITHOUT THE FILE EXTENSION !!
  */

const config = {
    sceneUrl: './src/custom/createAnims.ts', // You must adapt this line to your project
    addImport: false, // false to ignore imports lines
    imageType: 'png', // just in case someone use another type of images
    frameRateCoeff: 2, // animation frameRate = numbers of frames * frameRateCoeff
}

// *** Script ***
import { writeFileSync, readFileSync } from "fs";

const input = process.argv[2];
let atlasFile;
let loadingSceneFile;

checkFilesExists();

const arr = input.split('/');
const fileName = arr[arr.length - 1];

startProcessing();

// *** Functions ***
function startProcessing() {
    console.log('\x1b[33m%s\x1b[0m', 'Processing');

    let result;

    if(config.addImport) {
        const withImport = addImport();
        const withPreload = addPreLoader(withImport);
        result = addAnims(withPreload);
    }
    else
    {
        const withPreload = addPreLoader(loadingSceneFile);
        result = addAnims(withPreload);
    }

    writeFileSync(config.sceneUrl, result);

    console.log('\x1b[33m%s\x1b[0m', 'Done');
}

function checkFilesExists() {
    // Open the atlas passed as argument
    try {
        atlasFile = getFile(`${input}.json`);
    }
    catch(error) {
        console.log('\x1b[33m%s\x1b[0m', 'ERROR : Atlas asset not found')
        process.exit(1)
    }

    // Open the scene based on config
    try {
        loadingSceneFile = getFile(config.sceneUrl);
    }
    catch(error) {
        console.log('\x1b[33m%s\x1b[0m', 'ERROR :scene file not found');
        process.exit(1)
    }
}

function getFile(filename) {
    var data = readFileSync(filename, "utf8");
    return data;
}

function addImport() {
    const regexImportSection = /(?:\/\/ IMPORT ATLAS \/\/)/;
    const srcIndex = arr.findIndex(e => e = 'src');
    const relativeUrl = arr.slice(srcIndex);

    const newLoadingScene = loadingSceneFile.replace(regexImportSection, `// IMPORT ATLAS //
    import ${fileName}JSON from '${relativeUrl.join('/')}.json';
    import ${fileName} from '${relativeUrl.join('/')}.${config.imageType}';`);

    console.log('added import');

    return newLoadingScene;
}

function addPreLoader(loadingSceneWithImport) {
    const regexPreloadsection = /(?:\/\/ PRELOAD ATLAS \/\/)/;
    const arr = input.split('/');
    const srcIndex = arr.findIndex(e => e = 'src');
    const relativeUrl = arr.slice(srcIndex);
    let newLoadingScene;

    if(config.addImport) {
        newLoadingScene = loadingSceneWithImport.replace(regexPreloadsection, `// PRELOAD ATLAS //
    this.load.atlas('${fileName}', ${fileName}, ${fileName}JSON);`);
    }
    else
    {
        newLoadingScene = loadingSceneWithImport.replace(regexPreloadsection, `// PRELOAD ATLAS //
    this.load.atlas('${fileName}', '${relativeUrl.join('/')}.${config.imageType}', '${relativeUrl.join('/')}.json');`);
    }

    console.log('added preload');

    return newLoadingScene;
}

function addAnims(loadingSceneWithPreload) {
    const regexImportSection = /(?:\/\/ ANIMS ATLAS \/\/)/;
    const regexLastNumbers = /([0-9]+)$/;
    const atlasJsonObj = JSON.parse(atlasFile);

    let framesArray = atlasJsonObj.textures[0].frames;

    framesArray.sort((a, b) => {
        return a.filename - b.filename;
    });

    var currentFrame = '';
    var result = ``;
    var alreadyFilled = [];

    framesArray.forEach(frame => {
        const filename = frame.filename
        const frameNameTrimmed = filename.replace(regexLastNumbers, "");

        if(alreadyFilled.includes(frameNameTrimmed)) {
            return;
        }

        if(frameNameTrimmed !== currentFrame) {
            currentFrame = frameNameTrimmed;
            result += `
            this.anims.create({
                key: '${frameNameTrimmed.replace(/([^a-zA-Z0-9]+)$/, "")}',
                frames: [
            `
        }
        if(frameNameTrimmed === currentFrame) {
            const currentAnim = framesArray.filter(e => e.filename.replace(regexLastNumbers, "") === frameNameTrimmed);

            currentAnim.forEach(anim => {
                result += `{key: '${fileName}', frame: '${anim.filename}'},
                `;
            })

            result += `],
                frameRate: ${currentAnim.length * config.frameRateCoeff},
                repeat: -1,
            });
            `
            alreadyFilled.push(frameNameTrimmed)
        }
    });

    const newLoadingSceneWithAnims = loadingSceneWithPreload.replace(regexImportSection, `// ANIMS ATLAS //
    ${result}`);

    console.log('added animations');
    return newLoadingSceneWithAnims;
}
