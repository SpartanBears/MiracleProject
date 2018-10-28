var sys_races = [];

module.exports = {
	sys_races: sys_races,
};

//Race example

sys_races['dwarf'] = {
	name: "Dwarf",
	lore: "lore",
	bonus_stats:{
		str: 8,
		agi: 4,
		vit: 7,
		int: 4,
		dex: 5,
		luk: 5
	},
	bonus_attributes:{
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
	classes:{
		classes_0:[],
		classes_1:[],
		classes_2:[],
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

sys_races['dwarf'].classes["classes_0"]["merchant_0"] = {
	name:"Merchant",
	lore:"lore",
	main_stat: "luk",
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
	current_tier:"0",
	next_tier:"classes_1",
	next_class:"merchant_1",
};

sys_races['dwarf'].classes["classes_1"]["merchant_1"] = {
	name:"Trader",
	lore:"lore",
	main_stat: "luk",
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
	current_tier:"0",
	next_tier:"classes_2",
	next_class:"merchant_2",
};

sys_races['dwarf'].classes["classes_2"]["merchant_2"] = {
	name:"Master Trader",
	lore:"lore",
	main_stat: "luk",
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
	current_tier:"0",
	next_tier:"none",
	next_class:"none",
};