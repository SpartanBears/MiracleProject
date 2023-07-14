const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const statmods_path = project_paths.conf_stat_mods_folder;

const statmod_elements = JSON.parse(fs.readFileSync(statmods_path+'elements.json'));
const statmod_dmgtypes = JSON.parse(fs.readFileSync(statmods_path+'damage_types.json'));
const statmod_armortypes = JSON.parse(fs.readFileSync(statmods_path+'armor_types.json'));

const tick_generator = require(project_paths.ge_tick_generator);

let charA = {
    god_name:"Halian",
    name:"Grizz",
    race:"Dwarf",
    class:"Merchant",
    base_level:1,
    base_exp:1,
    class_level:1,
    class_exp:1,
    base_stats:{
        str:10,
        agi:10,
        vit:10,
        int:10,
        dex:10,
        luk:10
    },
    base_attributes:{
        hp:500,
        def:10,
        mdef:10,
        eva:10,
        matk:10,
        aspd:10,
        cspd:10,
        hit:10,
        crit:10
    },
    weapon:{
        name:"Le Hammerdin",
        type:"Blunt",
        element:"Neutral",
        str:10,
        agi:10,
        vit:10,
        int:10,
        dex:10,
        luk:10,
        hp:500,
        def:10,
        mdef:10,
        eva:10,
        matk:10,
        aspd:10,
        cspd:10,
        hit:10,
        crit:10
    },
    armor:{
        name:"Le Full Plate Mail",
        type:"Medium",
        element:"Neutral",
        str:10,
        agi:10,
        vit:10,
        int:10,
        dex:10,
        luk:10,
        hp:500,
        def:10,
        mdef:10,
        eva:10,
        matk:10,
        aspd:10,
        cspd:10,
        hit:10,
        crit:10
    },
    accesory_a:{
        name:"Empty",
        str:10,
        agi:10,
        vit:10,
        int:10,
        dex:10,
        luk:10,
        hp:500,
        def:10,
        mdef:10,
        eva:10,
        matk:10,
        aspd:10,
        cspd:10,
        hit:10,
        crit:10
    },
    accesory_b:{
        name:"Empty",
        str:10,
        agi:10,
        vit:10,
        int:10,
        dex:10,
        luk:10,
        hp:500,
        def:10,
        mdef:10,
        eva:10,
        matk:10,
        aspd:10,
        cspd:10,
        hit:10,
        crit:10
    }
};

let charB = {
    str:10,
    agi:10,
    vit:10,
    int:10,
    dex:10,
    luk:10,
    hp:500,
    def:10,
    mdef:10,
    eva:10,
    matk:10,
    aspd:10,
    cspd:10,
    hit:10,
    crit:10
};