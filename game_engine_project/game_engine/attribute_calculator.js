const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const statmods_path = project_paths.conf_stat_mods_folder;

//LOAD ELEMENTS, DAMAGE TYPES, ARMOR TYPES, RACES & CLASSES (STATIC CONTENT - MODIFIERS)
const statmod_races = JSON.parse(fs.readFileSync(statmods_path+'races.json'));
const race_names = Object.keys(statmod_races);
const attr_formulas = JSON.parse(fs.readFileSync(statmods_path+'attribute_formulas_variables.json'));

const statmod_classes = {};

for(let index = 0; index < race_names.length; index++){

    try{

        statmod_classes[race_names[index]] = JSON.parse(fs.readFileSync(statmods_path+'classes_'+race_names[index]+'.json'));

    }catch(err){

        //console.log(err);
    }
}

//STR, AGI, VIT, INT, DEX, LUK
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

    //GET TOTAL FROM STATS
    let totalHP_fromStats = 0;

    let hpFormula = attr_formulas.hp;

    let vit_total = getTotalStat(adventurer, 'vit');
    let adv_level = adventurer.base_level;

    totalHP_fromStats = Math.ceil(vit_total*hpFormula.vit_mult)+(Math.floor(adv_level/hpFormula.level_step)*hpFormula.level_step_bonus)+(Math.floor(vit_total/hpFormula.vit_step)*hpFormula.vit_step_hp_bonus)+(adv_level*hpFormula.per_level_hp_bonus);

    //AFTER CALCULATING THE TOTAL ATTR VALUE COMING FROM STATS, WE MUST ADD THE DIRECT BONUSES COMING FROM ALL THE SOURCES
    //RACE, CLASS AND ITEMS

    //RACE
    //IT IS APPLIED AS A %, SO IT MUST BE APPLIED TO THE VALUE CALCULATED FROM THE STATS
    let race_bonusHP = Math.ceil(totalHP_fromStats*statmod_races[adventurer.race.toLowerCase()]['hp']);

    //CLASS
    //IT IS APPLIED AS A %, SO IT MUST BE APPLIED TO THE VALUE CALCULATED FROM THE STATS
    let class_bonusHP = Math.ceil(totalHP_fromStats*statmod_classes[adventurer.race.toLowerCase()][adventurer.class.toLowerCase()]['hp']);

    //ITEMS
    //IT IS A FLAT BONUS
    let item_bonusHP = 0
    //CHECK WEAPON
    item_bonusHP += adventurer.weapon['hp'];
    //CHECK ARMOR
    item_bonusHP += adventurer.armor['hp'];
    //CHECK ACC A
    item_bonusHP += adventurer.accesory_a['hp'];
    //CHECK ACC B
    item_bonusHP += adventurer.accesory_b['hp'];

    //SUM ALL
    let total = totalHP_fromStats + race_bonusHP + class_bonusHP + item_bonusHP;

    return total;
}

function getTotal_DEF(adventurer){
    
    let total = 0;

    let defFormula = attr_formulas.def;
    let vit_total = getTotalStat(adventurer, 'vit');
    let dex_total = getTotalStat(adventurer, 'dex');

    total = Math.ceil(vit_total*defFormula.vit_mult)+(Math.floor(vit_total/defFormula.vit_step)*defFormula.vit_step_bonus)+(Math.floor(dex_total/defFormula.dex_step)*defFormula.dex_step_bonus);

    return total;
}

function getTotal_MDEF(adventurer){

    let total = 0;

    let mdefFormula = attr_formulas.mdef;
    let vit_total = getTotalStat(adventurer, 'vit');
    let int_total = getTotalStat(adventurer, 'int');

    total = Math.ceil(vit_total*mdefFormula.vit_mult)+(Math.floor(vit_total/mdefFormula.vit_step)*mdefFormula.vit_step_bonus)+(Math.floor(int_total/mdefFormula.int_step)*mdefFormula.int_step_bonus);
    return total;
}

function getTotal_EVA(adventurer){

    let total = 0;

    let evaFormula = attr_formulas.eva;
    let agi_total = getTotalStat(adventurer, 'agi');
    let dex_total = getTotalStat(adventurer, 'dex');

    total = Math.ceil(agi_total*evaFormula.agi_mult)+(Math.floor(agi_total/evaFormula.agi_step)*evaFormula.agi_step_bonus)+(Math.floor(dex_total/evaFormula.dex_step)*evaFormula.dex_step_bonus);
    return total;
}

function getTotal_ATK(adventurer){

    let total = 0;

    let atkFormula = attr_formulas.atk;
    let agi_total = getTotalStat(adventurer, 'agi');
    let str_total = getTotalStat(adventurer, 'str');

    total = Math.ceil(str_total*atkFormula.str_mult)+(Math.floor(str_total/atkFormula.str_step)*atkFormula.str_step_bonus)+(Math.floor(agi_total/atkFormula.agi_step)*atkFormula.agi_step_bonus);

    return total;
}

function getTotal_MATK(adventurer){

    let total = 0;

    let matkFormula = attr_formulas.matk;
    let int_total = getTotalStat(adventurer, 'int');

    total = Math.ceil(int_total*matkFormula.int_mult)+(Math.floor(int_total/matkFormula.int_step)*matkFormula.int_step_bonus);

    return total;
}

function getTotal_ASPD(adventurer){
    
    let total = 0;

    let aspdFormula = attr_formulas.aspd;
    let agi_total = getTotalStat(adventurer, 'agi');
    let dex_total = getTotalStat(adventurer, 'dex');

    total = Math.ceil(agi_total*aspdFormula.agi_mult)+Math.ceil(dex_total*aspdFormula.dex_mult);

    return total;
}

function getTotal_CSPD(adventurer){

    let total = 0;

    let cspdFormula = attr_formulas.cspd;
    let agi_total = getTotalStat(adventurer, 'agi');
    let dex_total = getTotalStat(adventurer, 'dex');

    total = Math.ceil(dex_total*cspdFormula.dex_mult)+Math.ceil(agi_total*cspdFormula.agi_mult);

    return total;
}

function getTotal_HIT(adventurer){

    let total = 0;

    let hitFormula = attr_formulas.hit;
    let int_total = getTotalStat(adventurer, 'int');
    let dex_total = getTotalStat(adventurer, 'dex');

    total = Math.ceil(dex_total*hitFormula.dex_mult)+(Math.floor(dex_total/hitFormula.dex_step)*hitFormula.dex_step_bonus)+(Math.floor(int_total/hitFormula.int_step)*hitFormula.int_step_bonus);

    return total;
}

function getTotal_CRIT(adventurer){

    let total = 0;

    let critFormula = attr_formulas.crit;
    let int_total = getTotalStat(adventurer, 'int');
    let dex_total = getTotalStat(adventurer, 'dex');
    let str_total = getTotalStat(adventurer, 'str');
    let agi_total = getTotalStat(adventurer, 'agi');
    let luk_total = getTotalStat(adventurer, 'luk');

    total = Math.ceil(str_total*critFormula.str_mult)+Math.ceil(int_total*critFormula.int_mult)+Math.ceil(dex_total*critFormula.dex_mult)+Math.ceil(agi_total*critFormula.agi_mult)+Math.ceil(luk_total*critFormula.luk_mult);

    return total;
}

exports.getTotal_HP = getTotal_HP; //Done
exports.getTotal_DEF = getTotal_DEF; //Done
exports.getTotal_MDEF = getTotal_MDEF; //Done
exports.getTotal_EVA = getTotal_EVA; //Done
exports.getTotal_ATK = getTotal_ATK; //Done
exports.getTotal_MATK = getTotal_MATK; //Done
exports.getTotal_ASPD = getTotal_ASPD; //Done
exports.getTotal_CSPD = getTotal_CSPD; //Done
exports.getTotal_HIT = getTotal_HIT; //Done
exports.getTotal_CRIT = getTotal_CRIT; //Done
exports.getTotalStat = getTotalStat;
