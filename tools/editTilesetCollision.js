import { readFileSync, writeFileSync } from "fs";

// tiles properties
const tiles = [
    {
        "id": 0,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 1,
        "properties": [
            {
                "name": "doorRoom",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 2,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 3,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            },
            {
                "name": "breakableBlock",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 4,
        "properties": [
            {
                "name": "doorBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 5,
        "properties": [
            {
                "name": "spikeBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 6,
        "properties": [
            {
                "name": "saveBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 7,
        "properties": [
            {
                "name": "hiddenBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 8,
        "properties": [
            {
                "name": "stair-bottom-right",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 9,
        "properties": [
            {
                "name": "stair-bottom-left",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 10,
        "properties": [
            {
                "name": "stair-right-end",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 11,
        "properties": [
            {
                "name": "stair-left-end",
                "type": "bool",
                "value": true
            }
        ]
    },
    {
        "id": 12,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            },
            {
                "name": "crumbleBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 13,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            },
            {
                "name": "crumbleBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 14,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            },
            {
                "name": "crumbleBlock",
                "type": "bool",
                "value": true
            }]
    },
    {
        "id": 15,
        "properties": [
            {
                "name": "collides",
                "type": "bool",
                "value": true
            },
            {
                "name": "crumbleBlock",
                "type": "bool",
                "value": true
            }]
    }
];


//function for file input
function getFile (filename)
{
    var data = readFileSync(filename, "ascii");
    return data;
}

//parsing json
for (let i = 1; i < 100; i++)
{
    try {
        var jsonString = [getFile(`./public/assets/maps/map${ i }.json`)];
        var jsonObj = JSON.parse(jsonString);

        jsonObj.tilesets.forEach(e =>
        {
            if (e.name === 'colliderTileset')
            {
                e.tiles = tiles;
            }
        });

        const jsonData = JSON.stringify(jsonObj);
        writeFileSync(`./public/assets/maps/map${ i }.json`, jsonData);
        
        const name = `map${ i }.json`;
        console.log("\x1b[32m", `map${ i }.json` + ' successfully edited');
    }
    catch (error)
    {
        if (error.errno !== -2)
        {
            console.log(error.errno);
        }
    }
}
console.log("\x1b[32m", 'Done');
