const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

//LOAD ELEMENTS, DAMAGE TYPES, ARMOR TYPES, RACES & CLASSES (STATIC CONTENT - MODIFIERS)
const statmods_path = project_paths.conf_stat_mods_folder;
const statmod_races = JSON.parse(fs.readFileSync(statmods_path+'races.json'));
const race_names = Object.keys(statmod_races);
const attr_calculator = require(project_paths.ge_attr_calculator);

const statmod_classes = {};

for(let index = 0; index < race_names.length; index++){

    try{

        statmod_classes[race_names[index]] = JSON.parse(fs.readFileSync(statmods_path+'classes_'+race_names[index]+'.json'));

    }catch(err){

        //console.log(err);
    }
}

function atk_adv(adventurerA, adventurerD){

    let atk_advA    =   attr_calculator.getTotal_ATK(adventurerA);
    let hit_advA    =   attr_calculator.getTotal_HIT(adventurerA);
    let crit_advA   =   attr_calculator.getTotal_CRIT(adventurerA);
    let def_advD    =   attr_calculator.getTotal_DEF(adventurerD);
    let eva_advD    =   attr_calculator.getTotal_EVA(adventurerD);
    let hp_advD     =   attr_calculator.getTotal_HP(adventurerD);

    let result = calc_dmg(atk_advA, hit_advA, crit_advA, def_advD, eva_advD, hp_advD)
    return {
        "attack" : {
            adv_name    : adventurerA.god_name,
            adv_race    : adventurerA.race,
            adv_class   : adventurerA.class,
            adv_ATK     : atk_advA,
            adv_HIT     : hit_advA,
            adv_CRIT    : crit_advA,
        },
        "defense" : {
            adv_name    : adventurerD.god_name,
            adv_race    : adventurerD.race,
            adv_class   : adventurerD.class,
            adv_DEF     : def_advD,
            adv_HP      : hp_advD,
            adv_EVA     : eva_advD
        },
        result
    }
}

function calc_dmg(atk_advA, hit_advA, crit_advA, def_advD, eva_advD, hp_advD){
    return {
        HP_lost : 0,
        EVA_chance : 0 + '%',
        HIT_chance : 0 + '%',
        CRIT_chance : 0 + '%',
        MATH_calc : 'FORMULA DAÑO'
    }
}

exports.atk_adv = atk_adv;
