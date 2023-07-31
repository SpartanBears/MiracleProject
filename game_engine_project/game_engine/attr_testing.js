const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const attr_calculator = require(project_paths.ge_attr_calculator);
const player_gen = require(project_paths.ge_battle_player_gen);

const statmods_path = project_paths.conf_stat_mods_folder;

const statmod_elements = JSON.parse(fs.readFileSync(statmods_path+'elements.json'));
const statmod_dmgtypes = JSON.parse(fs.readFileSync(statmods_path+'damage_types.json'));
const statmod_armortypes = JSON.parse(fs.readFileSync(statmods_path+'armor_types.json'));

const player_test = player_gen.getPlayer;

console.log(attr_calculator.getTotal_HP(player_test)); //APROBADO
//console.log(attr_calculator.getTotal_DEF(charA)); //APROBADO
//console.log(attr_calculator.getTotal_MDEF(charA)); //APROBADO
//console.log(attr_calculator.getTotal_EVA(charA)); //APROBADO
//console.log(attr_calculator.getTotal_ATK(charA)); //APROBADO
//console.log(attr_calculator.getTotal_MATK(charA)); //APROBADO
//console.log(attr_calculator.getTotal_ASPD(charA)); //APROBADO
//console.log(attr_calculator.getTotal_CSPD(charA)); //APROBADO
//console.log(attr_calculator.getTotal_HIT(charA)); //APROBADO
//console.log(attr_calculator.getTotal_CRIT(charA)); //APROBADO

//Testing
//console.log(attr_calculator.getTotal_CRIT(charA)); 
//console.log(attr_calculator.getTotalStat(charA, 'luk'));
