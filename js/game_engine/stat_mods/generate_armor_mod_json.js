const fs = require('fs');

let output_json = {};

const armor_types = ['light', 'medium', 'heavy'];
const modded_stats = ['aspd', 'cspd', 'hit', 'eva'];

const mods = [
    [0.25,0.25,0.25,0.25],
    [0,0,0,0],
    [-0.25,0,-0.1,-0.25]
];

for(let indexDT = 0; indexDT < armor_types.length; indexDT++){

    output_json[armor_types[indexDT]] = {};

    for(let indexMod = 0; indexMod < modded_stats.length; indexMod++){

        output_json[armor_types[indexDT]][modded_stats[indexMod]] = mods[indexDT][indexMod];
    }
}

fs.writeFileSync('./armor_mod.json', JSON.stringify(output_json, null, 2));



