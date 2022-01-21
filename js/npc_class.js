class NPC {

    constructor(json){

        /*
            JSON format

            {
                name,
                type,
                familia:{
                    name,
                    god_name
                }
                class:{
                    race,
                    name
                },
                stats_base:{
                    level,
                    str,
                    agi,
                    vit,
                    int,
                    dex,
                    luk
                },
                equipment:{
                    armor:{
                        type,
                        element:{
                            type,
                            level
                        },
                        stats_base:{
                            def,
                            mdef
                        },
                        stats_mods:{ *EACH KEY IS OPTIONAL*
                            str,
                            agi,
                            vit,
                            int,
                            dex,
                            luk,
                            hp,
                            def,
                            mdef,
                            eva,
                            atk,
                            matk,
                            aspd,
                            cspd,
                            hit,
                            crit
                        }
                    },
                    weapon:{
                        type,
                        element:{
                            type,
                            level
                        },
                        stats_base:{
                            atk,
                            matk
                        },
                        stats_mods:{ *EACH KEY IS OPTIONAL*
                            str,
                            agi,
                            vit,
                            int,
                            dex,
                            luk,
                            hp,
                            def,
                            mdef,
                            eva,
                            atk,
                            matk,
                            aspd,
                            cspd,
                            hit,
                            crit
                        }
                    },
                    accesory_a:{
                        stats_mods:{ *EACH KEY IS OPTIONAL*
                            str,
                            agi,
                            vit,
                            int,
                            dex,
                            luk,
                            hp,
                            def,
                            mdef,
                            eva,
                            atk,
                            matk,
                            aspd,
                            cspd,
                            hit,
                            crit
                        }
                    },
                    accesory_b:{
                        stats_mods:{ *EACH KEY IS OPTIONAL*
                            str,
                            agi,
                            vit,
                            int,
                            dex,
                            luk,
                            hp,
                            def,
                            mdef,
                            eva,
                            atk,
                            matk,
                            aspd,
                            cspd,
                            hit,
                            crit
                        }
                    }
                }
            }
        */
        

        this.type = type;
        this.name = name;
        this.level = level;
        this.str = str;
        this.agi = agi;
        this.vit = vit;
        this.int = int;
        this.dex = dex;
        this.luk = luk;
    }

    getStat(stat_name){

        let value = -1;

        switch(stat_name){

            case "str":
                value = this.str;
                break;

            case "agi":
                value = this.agi;
                break;

            case "vit":
                value = this.vit;
                break;

            case "int":
                value = this.int;
                break;

            case "dex":
                value = this.dex;
                break;

            case "luk":
                value = this.luk;
                break;

            default:
                value = -1;
                break;
        }

        return value;
    }

    getJSON(){

        let npc_json = "";



        return npc_json;
    }

    eqBaseHP(){

        //Math.ceil(VIT*vit_multiplier) + (Level*(Math.ceil(Level/level_divide)+per_level_base_bonus))
        const vit_multiplier = 2.5;
        const level_divide = 10;
        const per_level_base_bonus = 10;
        
        let hp_value = 0;

        hp_value = Math.ceil(this.vit*vit_multiplier)+(this.level*(Math.ceil(this.level/level_divide)+per_level_base_bonus));

        return hp_value;
    }
    
}