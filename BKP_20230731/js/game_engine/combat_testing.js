const fs = require('fs');

const statmods_path = '/opt/miracle_project/game_engine/stat_mods/';

//LOAD ELEMENTS, DAMAGE TYPES, ARMOR TYPES, RACES & CLASSES (STATIC CONTENT - MODIFIERS)
const statmod_elements = JSON.parse(fs.readFileSync(statmods_path+'elements.json'));
const statmod_dmgtypes = JSON.parse(fs.readFileSync(statmods_path+'damage_types.json'));
const statmod_armortypes = JSON.parse(fs.readFileSync(statmods_path+'armor_types.json'));
const statmod_races = JSON.parse(fs.readFileSync(statmods_path+'races.json'));
const statmod_classes = JSON.parse(fs.readFileSync(statmods_path+'classes.json'));