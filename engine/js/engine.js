/*
	Classes, Races, Stats, and every other aspect of the game, will be objects.
*/

//Race example
var classes['dwarf'] = {
	name: "Dwarf",
	base_stats:{
		str: 8,
		agi: 4,
		vit: 7,
		int: 4,
		dex: 5,
		luk: 5
	},
	base_attributes:{
		hp: 500,
		def: 25,
		mdef: 35,
		eva: 5,
		atk: 25,
		matk: 5,
		aspd: 0.5,
		cspd: 0.1,
		hit: 25
	},
}

/* 
	Characters will cast skills automatically depending on their stats and level.
	The skill will be selected randomly from a skill pool.
	Skills will affect stats or attributes, and wont have an special formula to calculate its effects.

	i.e: Healing skills have a formula to calculate the amount of HP healed based on the character stats. 
	The healing skill will allow the character to heal and improve the stats that are involved in the calculation.
	Healing = matk * (int*0.5>1?int*0.5:1)
	So, the Healing skill will provide bonus int and matk
*/

var skills["dwarf"] = [

	{
		name: "Heavy Blow",
		type: "Damage",
		bonus_stats:{
			str: 10,
			agi: 0,
			vit: 0,
			int: 0,
			dex: -2,
			luk: 0
		},
		bonus_attributes:{
			hp: 0,
			def: -5,
			mdef: 0,
			eva: 0,
			atk: 100,
			matk: 0,
			aspd: 0,
			cspd: 0,
			hit: -5
		}

	}

];