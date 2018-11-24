/*
	There will be three types of equipment available to gear up adventurers:
	- Armor: Represents a full body set, from helmet to boots.
		Will affect any stat and the following attributes: hp, def, mdef, eva.
		Armors will be categorized by Light, Medium or Heavy types.
	
	- Weapons: Equipment carried in both hands to fight. Sword & Shield count 
	as ONE piece of equipment.

		Bruiser = Tank, Berserk, etc
		Scholar = Wizard, Mage, Cleric, Merchant, etc
		Striker = Rogue, Assassin, Thief, Archer, etc
		
		Types of weapons:
			- Two handed: 
				Sword and Shield (Bruiser)
				Scepter and Buckler (Scholar)
				Spellstone and Buckler (Scholar)
				Dagger and Buckler (Striker)
				Axe (Bruiser), 
				Staff (Scholar), 
				Lance (Striker), 
				Mace (Bruiser), 
				Hammer (Brsuier),
				Sword (Bruiser),
				Bow (Striker),


			- Dual Wield: 
				Swords (Bruiser), 
				Axes (Bruiser), 
				Daggers (Striker), 
				Staff (Striker), 
				Katars (Striker), 
				Knuckles (Bruiser, Striker), 
				Hammers (Bruiser),
				Spellstones (Scholar),

		Will affect any stat and the following attributes: atk, matk, aspd, cspd, hit
	
	- Jewelery: A piece or a set of jewellery.
		Adventurers can have just one item of each category equipped at any time.
		Will affect any stat or any attribute

	Equipment objects will have as its keys the attributes it is going to modify.
	i.e: 

	var armorExample = {
		str: 3,
		agi: -2,
		dex: -1,
		def: 27,
		mdef: 21,
		eva: -50,
	};

	There will be 7 tiers of equipment: 
	(1 or C) Poor, 
	(2 or B) Common, 
	(3 or A) Magic, 
	(4 or S) Rare, 
	(5 or SS) Unique, 
	(6 or SSS) Legendary, 
	(7 or G) Godly

	Depending on the grade is the ammount of attributes or stats it will provide (See xls).

*/

var EquipmentCodex = require("./equip_library.js");

module.exports = {
	generateEquipment:generateEquipment,
};

function generateEquipment(type, tier){

	switch(type){

		case "armor":
		break;

		case "weapon":
		break;

		case: "jewelery":
		break;

		default:
		break;
	}
}
