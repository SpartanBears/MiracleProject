const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

/*Este engine tiene como objetivo manejar la creacion, modificacion y destruccion de items dentro del juego.
Los items equipables son una coleccion de stats que se entregan como bonificacion al aventurero que lo tenga equipado.
Los items usables son items, que como su nombre indica, se pueden utilizar para obtener un beneficio especifico.

Existen 2 templates de items equipables:
    - Items de combate: poseen la colección de stats ademas de un tipo y elemento
    - Items accesorios: solo poseen una coleccion de stats


Restore/Deplete
Increase/Decrease
Set

Item equipable de combate
    id:56165156,
    item_type:"combat",
    name:"Le Hammerdin",
    type:"Blunt",
    element:"Neutral",
    requirements:{
        "adv_level": 50,
        "class":[{"race":"dwarf", "class":"merchant"}],
        "stat":[{"name":"str","value":"50"}, {"name":"vit","value":"20"}]
    },
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
    atk:10,
    matk:10,
    aspd:10,
    cspd:10,
    hit:10,
    crit:10

Item equipable no-combate
    id:515616,
    item_type:"non_combat",
    name:"Le Corbusier",
    requirements:{
        "adv_level": 50,
        "class":[{"race":"dwarf", "class":"merchant"}],
        "stat":[{"name":"str","value":"50"}, {"name":"vit","value":"20"}]
    },
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
    atk:10,
    matk:10,
    aspd:10,
    cspd:10,
    hit:10,
    crit:10

Item usable
    id:50500,
    item_type:"usable",
    name:"Rejuvenation Elixir of The Mage",
    requirements:{
        "adv_level": 50,
        "class":[{"race":"dwarf", "class":"merchant"}],
        "stat":[{"name":"str","value":"50"}, {"name":"vit","value":"20"}]
    },
    targets:[
        {  
            "attr":"hp",
            "action":"restore",
            "applied_as":"percent",
            "value":100,
            "duration":0
        },
        {  
            "attr":"matk",
            "action":"increase",
            "applied_as":"flat",
            "value":50,
            "duration":30
        }
    ]

*/