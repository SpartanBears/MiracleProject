const fs = require('fs');

let output_json = {};

const races = ['dwarf', 'orc', 'elf', 'human'];
const stats = ['str', 'agi', 'vit', 'int', 'dex', 'luk', 'hp', 'def', 'mdef', 'eva', 'atk', 'matk', 'aspd', 'cspd', 'hit', 'crit'];

const mods = [
    [0.1,-0.2,0.2,0.1,0,0.2,0.2,0.2,0.2,-0.1,0.2,0,-0.1,0,0,0],
    [0.2,0.1,0.2,-0.2,0.1,0,0.1,0.2,0.1,0.1,0.2,0,0,0,0,0.1],
    [-0.2,0.2,-0.2,0.2,0.2,0,-0.2,-0.2,0.2,0.2,0,0.2,0.2,0.2,0.2,0.2],
    [0,0,0,0.1,0.1,0.1,0,0,0,0.1,0.1,0.1,0.1,0.1,0.1,0.1]
];

for(let indexRace = 0; indexRace < races.length; indexRace++){

    output_json[races[indexRace]] = {};

    for(let indexMod = 0; indexMod < stats.length; indexMod++){

        output_json[races[indexRace]][stats[indexMod]] = mods[indexRace][indexMod];
    }
}

fs.writeFileSync('./races.json', JSON.stringify(output_json, null, 2));



