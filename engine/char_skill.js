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

module.exports = {

	skills: skills,
};

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