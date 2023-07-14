const fs = require('fs');

let output_json = {};

const classes = ['merchant'];
const classes_stats = [
    [0.1,0,0.1,0.1,0,0.15,0,0,0,0,0,0,0,0,0]
];
const stats = ['str', 'agi', 'vit', 'int', 'dex', 'luk', 'hp', 'def', 'mdef', 'eva', 'atk', 'matk', 'aspd', 'cspd', 'hit', 'crit'];

for(let indexClass = 0; indexClass < classes.length; indexClass++){

    output_json[classes[indexClass]] = {};

    for(let indexStat = 0; indexStat < stats.length; indexStat++){

        output_json[classes[indexClass]][stats[indexStat]] = classes_stats[indexClass][indexStat];
    }
}

fs.writeFileSync('./classes_dwarf.json', JSON.stringify(output_json, null, 2));


