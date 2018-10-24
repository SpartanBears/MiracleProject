/*
	Classes, Races, Stats, and every other aspect of the game, will be objects.
*/

//Race example
var races = [];

races['dwarf'] = {
	name: "Dwarf",
	lore: "lore",
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
	}
};

//Class example
/*
	There will be classes or jobs for the characters.
	Each class can have an "evolution" or "decendant".
	Each "step" of the class will be defined in a separate object
	i.e: ClassA1 -> ClassA2 -> ClassA3
	classes1["ClassA1"].next = ClassA2;
	classes2["ClassA2"].next = ClassA3;
	etc.

	Classes will give the character access to different skills and
	will recieve bonuses to its stats or attributes.
*/

var classes = {
	classes_0:[],
	classes_1:[],
	classes_2:[],
};

classes["classes_0"]["merchant_0"] = {
	name:"Merchant",
	lore:"lore",
	bonus_stats:{
		str: 0,
		agi: 0,
		vit: 10,
		int: 10,
		dex: 0,
		luk: 10
	},
	bonus_attributes:{
		hp: 500,
		def: 25,
		mdef: 25,
		eva: 0,
		atk: 0,
		matk: 0,
		aspd: 0,
		cspd: 0,
		hit: 25
	},
	next_tier:"classes_1",
	next_class:"merchant_1",
};

classes["classes_1"]["merchant_1"] = {
	name:"Trader",
	lore:"lore",
	bonus_stats:{
		str: 0,
		agi: 0,
		vit: 10,
		int: 10,
		dex: 0,
		luk: 20
	},
	bonus_attributes:{
		hp: 500,
		def: 25,
		mdef: 25,
		eva: 0,
		atk: 0,
		matk: 0,
		aspd: 0,
		cspd: 0,
		hit: 25
	},
	next_tier:"classes_2",
	next_class:"merchant_2",
};

classes["classes_2"]["merchant_2"] = {
	name:"Master Trader",
	lore:"lore",
	bonus_stats:{
		str: 0,
		agi: 0,
		vit: 10,
		int: 10,
		dex: 0,
		luk: 20
	},
	bonus_attributes:{
		hp: 500,
		def: 25,
		mdef: 25,
		eva: 0,
		atk: 0,
		matk: 0,
		aspd: 0,
		cspd: 0,
		hit: 25
	},
	next_tier:"none",
	next_class:"none",
};

/* 
	Characters will cast skills automatically depending on their stats and level.
	The skill will be selected randomly from a skill pool.
	Skills will affect stats or attributes, and wont have an special formula to calculate its effects.
	Each skill will be classified in one and only one of these categories:
	- Damage
	- Healing
	- Support

	Damage skills will use the default atk/matk, crit, aspd formulas.
	Healing and Support skills will have an special formula for their categories.

	Healing = matk * (int*0.5>1?int*0.5:1)
	Support = ?

	i.e: Healing skills have a formula to calculate the amount of HP healed based on the character stats. 
	The healing skill will allow the character to heal and improve the stats that are involved in the calculation.
	Healing = matk * (int*0.5>1?int*0.5:1)
	So, the Healing skill will provide bonus int and matk, instead of having
	it's own formula.

	Skills will be sorted/grouped by race or class/job
*/

var skills = [];


skills["Dwarf"] = [

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

	},

];

skills["Merchant"] = [
	{
		name: "Loot",
		type: "Support",
		bonus_stats:{
			str: 5,
			agi: 0,
			vit: 0,
			int: 0,
			dex: 0,
			luk: 25
		},
		bonus_attributes:{
			hp: 0,
			def: 0,
			mdef: 0,
			eva: 0,
			atk: 0,
			matk: 0,
			aspd: 0,
			cspd: 0,
			hit: 0
		}
	},
];

//Character creation
/*
	All NPCs will have a race and a class.

	TODO: Monsters?  
*/