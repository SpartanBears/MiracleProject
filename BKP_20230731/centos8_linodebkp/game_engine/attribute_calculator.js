const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const statmods_path = project_paths.conf_stat_mods_folder;

//LOAD ELEMENTS, DAMAGE TYPES, ARMOR TYPES, RACES & CLASSES (STATIC CONTENT - MODIFIERS)
const statmod_races = JSON.parse(fs.readFileSync(statmods_path+'races.json'));
const race_names = Object.keys(statmod_races);

const statmod_classes = {};

for(let index = 0; index < race_names.length; index++){

    try{

        statmod_classes[race_names[index]] = JSON.parse(fs.readFileSync(statmods_path+'classes_'+race_names[index]+'.json'));

    }catch(err){

        //console.log(err);
    }
}

function getTotalStat(adventurer, stat){

    stat = stat.toLowerCase();

    let total = 0;

    //BASE STAT
    total += adventurer.base_stats[stat];
    //RACE BONUS
    total += Math.ceil(adventurer.base_stats.str*statmod_races[adventurer.race.toLowerCase()][stat]);
    //CLASS BONUS
    total += Math.ceil(adventurer.base_stats.str*statmod_classes[adventurer.race.toLowerCase()][adventurer.class.toLowerCase()][stat]);
    //WEAPON BONUS
    total += adventurer.weapon[stat];
    //ARMOR BONUS
    total += adventurer.armor[stat];
    //ACCESORY_A BONUS
    total += adventurer.accesory_a[stat];
    //ACCESORY_B BONUS
    total += adventurer.accesory_b[stat];

    return total;

}

function getTotal_HP(adventurer){

    let total = 0;

    //create file with attribute formulas variables

    total = Math.ceil();

    return total;
}

function getTotal_DEF(adventurer){
    
    let total = 0;

    return total;
}

function getTotal_MDEF(adventurer){

    let total = 0;

    return total;
}

function getTotal_EVA(adventurer){

    let total = 0;

    return total;
}

function getTotal_ATK(adventurer){

    let total = 0;

    return total;
}

function getTotal_MATK(adventurer){

    let total = 0;

    return total;
}

function getTotal_ASPD(adventurer){
    
    let total = 0;

    return total;
}

function getTotal_CSPD(adventurer){

    let total = 0;

    return total;
}

function getTotal_HIT(adventurer){

    let total = 0;

    return total;
}

function getTotal_CRIT(adventurer){

    let total = 0;

    return total;
}

exports.getTotal_HP = getTotal_HP;