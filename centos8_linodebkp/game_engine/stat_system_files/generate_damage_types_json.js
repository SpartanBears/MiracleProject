const fs = require('fs');

let output_json = {};

const damage_types = ['slash', 'blunt', 'piercing', 'magic'];
const armor_types = ['light', 'medium', 'heavy'];

const mods = [
    [1.25,1,0.5],
    [1,0.75,1],
    [1.25,1.25,0.75],
    [1.25,1.25,1]
];

for(let indexDT = 0; indexDT < damage_types.length; indexDT++){

    output_json[damage_types[indexDT]] = {};

    for(let indexMod = 0; indexMod < mods.length; indexMod++){

        output_json[damage_types[indexDT]][armor_types[indexMod]] = mods[indexDT][indexMod];
    }
}

fs.writeFileSync('./damage_types.json', JSON.stringify(output_json, null, 2));



