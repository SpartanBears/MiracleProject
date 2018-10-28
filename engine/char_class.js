//DEPRECATED - check char_race.js to see working example.

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

	check char_class.js to see working example.

*/

/*var classes = {
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
};*/