var CharRace = require("./char_race.js");
var EngineTools = require("./engine_tools.js");

module.exports = {

	createNewCharacter : createNewCharacter,
};

//Character object
/*
	NPCs will have a race and a class. This is the object to be used as a character.
	NPCs will have a name, race and class (tier 0)
*/

function createNewCharacter(charName, charLevel){

	var character = {};

	character.char_name = charName;

	character.race = getRandomRace();

	character.class = getRandomClass(0, character.race);

	character.level = charLevel;

	character.unusedStatPoints = character.level == 1 ? 0:Math.ceil((character.level*0.25)+5);

	character.base_stats = {
		str: character.class.main_stat == "str" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
		agi: character.class.main_stat == "agi" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
		vit: character.class.main_stat == "vit" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
		int: character.class.main_stat == "int" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
		dex: character.class.main_stat == "dex" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
		luk: character.class.main_stat == "luk" ? EngineTools.getRandomNumber(5,9):EngineTools.getRandomNumber(2,5),
	};

	//bonus stats from equipment, buffs, etc
	character.bonus_stats = {
		str: 0,
		agi: 0,
		vit: 0,
		int: 0,
		dex: 0,
		luk: 0,
	};
	
	randomAllocateStatsPoints(character);

	//bonus attributes from equipment, buffs, etc
	character.bonus_attributes = {
		hp: 0,
		def: 0,
		mdef: 0,
		eva: 0,
		atk: 0,
		matk: 0,
		aspd: 0,
		cspd: 0,
		hit: 0,
	};

	//attributes after calculations
	character.final_attributes= {
		hp: 0,
		def: 0,
		mdef: 0,
		eva: 0,
		atk: 0,
		matk: 0,
		aspd: 0,
		cspd: 0,
		hit: 0,
	};

	calculateCharacterAttr(character, "all");

	return character;
}

function getRandomRace(){

	return CharRace.sys_races[Object.keys(CharRace.sys_races)[EngineTools.getRandomNumber(0,Object.keys(CharRace.sys_races).length)]];
}

function getRandomClass(tier, race){

	return race.classes['classes_'+tier][Object.keys(race.classes['classes_'+tier])[EngineTools.getRandomNumber(0,Object.keys(race.classes['classes_'+tier]).length)]];
}

function randomAllocateStatsPoints(character){

	//allocate main stat first (30% min 50% max of total)
	var mainStatAllocationQty = EngineTools.getRandomNumber(Math.floor(character.unusedStatPoints*0.3), Math.floor(character.unusedStatPoints*0.5));

	character.base_stats[character.class.main_stat] += mainStatAllocationQty;
	character.unusedStatPoints -= mainStatAllocationQty;

	//allocate randomly min 1 max 20%
	var count = 0;
	var statsList = ["agi", "vit", "int", "dex", "luk"];
	while(character.unusedStatPoints > 0){

		var allocation = EngineTools.getRandomNumber(1, Math.floor(character.unusedStatPoints*0.2));
		character.base_stats[statsList[count]] += allocation;
		character.unusedStatPoints -= allocation;
		count++;

		if(count >= statsList.length-1){
			count = 0;
		}
	}
}

function calculateCharacterAttr(character, attr){

	switch(attr){

		case "hp":

			var characterMaxHp = 0;

			//get bonus attributes and stats
			var bonusHpSum = 0;
			var vitSum = 0;

			//racial stats & attr
			vitSum += character.race.bonus_stats.vit;
			bonusHpSum += character.race.bonus_attributes.hp;

			//class stats & attr
			vitSum += character.class.bonus_stats.vit;
			bonusHpSum += character.class.bonus_attributes.hp;

			//character stats
			vitSum += character.base_stats.vit;
			vitSum += character.bonus_stats.vit;
			bonusHpSum += character.bonus_attributes.hp;

			//calculate Max HP [(VIT*2.5) + (Level*(Math.floor(Level/10)+10)) + bonuses]
			characterMaxHp = (vitSum*2.5) + (character.level*(Math.floor(character.level/10)+10)) + bonusHpSum;

			character.final_attributes.hp = Math.ceil(characterMaxHp);

		break;

		case "def":

			var characterDef = 0;

			//get bonus attributes and stats
			var bonusDefSum = 0;
			var vitSum = 0;
			var dexSum = 0;

			//racial stats & attr
			vitSum += character.race.bonus_stats.vit;
			dexSum += character.race.bonus_stats.dex;
			bonusDefSum += character.race.bonus_attributes.def;

			//class stats & attr
			vitSum += character.class.bonus_stats.vit;
			dexSum += character.class.bonus_stats.dex;
			bonusDefSum += character.class.bonus_attributes.def;

			//character stats
			vitSum += character.base_stats.vit;
			vitSum += character.bonus_stats.vit;
			dexSum += character.base_stats.dex;
			dexSum += character.bonus_stats.dex;
			bonusDefSum += character.bonus_attributes.def;

			//calculate Def [(VIT*0.3) + (DEX*0.09) + (Level*0.125) + bonuses]
			characterDef = (vitSum*0.3) + (dexSum*0.09) + (character.level*0.125) + bonusDefSum;

			character.final_attributes.def = Math.ceil(characterDef);

		break;

		case "mdef":

			var characterMdef = 0;

			//get bonus attributes and stats
			var bonusMdefSum = 0;
			var vitSum = 0;
			var intSum = 0;

			//racial stats & attr
			vitSum += character.race.bonus_stats.vit;
			intSum += character.race.bonus_stats.int;
			bonusMdefSum += character.race.bonus_attributes.mdef;

			//class stats & attr
			vitSum += character.class.bonus_stats.vit;
			intSum += character.class.bonus_stats.int;
			bonusMdefSum += character.class.bonus_attributes.mdef;

			//character stats
			vitSum += character.base_stats.vit;
			vitSum += character.bonus_stats.vit;
			intSum += character.base_stats.int;
			intSum += character.bonus_stats.int;
			bonusMdefSum += character.bonus_attributes.mdef;

			//calculate Mdef [(VIT*0.15) + (INT*0.3) + (Level*0.125) + bonuses]
			characterMdef = (vitSum*0.15) + (intSum*0.3) + (character.level*0.125) + bonusMdefSum;

			character.final_attributes.mdef = Math.ceil(characterMdef);

		break;

		case "eva":

			var characterEva = 0;

			//get bonus attributes and stats
			var bonusEvaSum = 0;
			var agiSum = 0;
			var dexSum = 0;

			//racial stats & attr
			agiSum += character.race.bonus_stats.agi;
			dexSum += character.race.bonus_stats.dex;
			bonusEvaSum += character.race.bonus_attributes.eva;

			//class stats & attr
			agiSum += character.class.bonus_stats.agi;
			dexSum += character.class.bonus_stats.dex;
			bonusEvaSum += character.class.bonus_attributes.eva;

			//character stats
			agiSum += character.base_stats.agi;
			agiSum += character.bonus_stats.agi;
			dexSum += character.base_stats.dex;
			dexSum += character.bonus_stats.dex;
			bonusEvaSum += character.bonus_attributes.eva;

			//calculate Eva [(AGI*3) + (DEX*1.5) + bonuses]
			characterEva = (agiSum*3) + (dexSum*1.5) + bonusEvaSum;

			character.final_attributes.eva = Math.ceil(characterEva);

		break;

		case "atk":

			var characterAtk = 0;

			//get bonus attributes and stats
			var bonusAtkSum = 0;
			var strSum = 0;
			var agiSum = 0;

			//racial stats & attr
			strSum += character.race.bonus_stats.str;
			agiSum += character.race.bonus_stats.agi;
			bonusAtkSum += character.race.bonus_attributes.atk;

			//class stats & attr
			strSum += character.class.bonus_stats.str;
			agiSum += character.class.bonus_stats.agi;
			bonusAtkSum += character.class.bonus_attributes.atk;

			//character stats
			strSum += character.base_stats.str;
			strSum += character.bonus_stats.str;
			agiSum += character.base_stats.agi;
			agiSum += character.bonus_stats.agi;
			bonusAtkSum += character.bonus_attributes.atk;

			//calculate Eva [(STR*3) + (AGI*1.25) + ((Level*(STR+AGI))/5) + bonus]
			characterAtk = (strSum*3) + (agiSum*1.25) + ((character.level*(strSum+agiSum))/5) + bonusAtkSum;

			character.final_attributes.atk = Math.ceil(characterAtk);

		break;

		case "matk":

			var characterMatk = 0;

			//get bonus attributes and stats
			var bonusMatkSum = 0;
			var intSum = 0;

			//racial stats & attr
			intSum += character.race.bonus_stats.int;
			bonusMatkSum += character.race.bonus_attributes.matk;

			//class stats & attr
			intSum += character.class.bonus_stats.int;
			bonusMatkSum += character.class.bonus_attributes.matk;

			//character stats
			intSum += character.base_stats.int;
			intSum += character.bonus_stats.int;
			bonusMatkSum += character.bonus_attributes.matk;

			//calculate Matk [(INT*4) + ((Level*(INT*2))/5) + bonus]
			characterMatk = (intSum*4) + Math.ceil(((character.level*(intSum*2))/5)) + bonusMatkSum;

			character.final_attributes.matk = Math.ceil(characterMatk);

		break;

		case "aspd":

			var characterAspd = 0;

			//get bonus attributes and stats
			var bonusAspdSum = 0;
			var agiSum = 0;
			var dexSum = 0;

			//racial stats & attr
			agiSum += character.race.bonus_stats.agi;
			dexSum += character.race.bonus_stats.dex;
			bonusAspdSum += character.race.bonus_attributes.aspd;

			//class stats & attr
			agiSum += character.class.bonus_stats.agi;
			dexSum += character.class.bonus_stats.dex;
			bonusAspdSum += character.class.bonus_attributes.aspd;

			//character stats
			agiSum += character.base_stats.agi;
			agiSum += character.bonus_stats.agi;
			dexSum += character.base_stats.dex;
			dexSum += character.bonus_stats.dex;
			bonusAspdSum += character.bonus_attributes.aspd;

			//calculate Aspd [(AGI*0.0125) + (DEX*0.005) + bonus]
			characterAspd = (agiSum*0.0125) + (dexSum*0.005) + bonusAspdSum;

			character.final_attributes.aspd = characterAspd;

		break;

		case "cspd":

			var characterCspd = 0;

			//get bonus attributes and stats
			var bonusCspdSum = 0;
			var agiSum = 0;
			var dexSum = 0;

			//racial stats & attr
			agiSum += character.race.bonus_stats.agi;
			dexSum += character.race.bonus_stats.dex;
			bonusCspdSum += character.race.bonus_attributes.cspd;

			//class stats & attr
			agiSum += character.class.bonus_stats.agi;
			dexSum += character.class.bonus_stats.dex;
			bonusCspdSum += character.class.bonus_attributes.cspd;

			//character stats
			agiSum += character.base_stats.agi;
			agiSum += character.bonus_stats.agi;
			dexSum += character.base_stats.dex;
			dexSum += character.bonus_stats.dex;
			bonusCspdSum += character.bonus_attributes.cspd;

			//calculate Aspd [(DEX*0.005) + (AGI*0.0025) + bonus]
			characterCspd = (dexSum*0.005) + (agiSum*0.0025) + bonusCspdSum;

			character.final_attributes.cspd = characterCspd;

		break;

		case "hit":

			var characterHit = 0;

			//get bonus attributes and stats
			var bonusHitSum = 0;
			var dexSum = 0;
			var intSum = 0;

			//racial stats & attr
			dexSum += character.race.bonus_stats.dex;
			intSum += character.race.bonus_stats.int;
			bonusHitSum += character.race.bonus_attributes.hit;

			//class stats & attr
			dexSum += character.class.bonus_stats.dex;
			intSum += character.class.bonus_stats.int;
			bonusHitSum += character.class.bonus_attributes.hit;

			//character stats
			dexSum += character.base_stats.dex;
			dexSum += character.bonus_stats.dex;
			intSum += character.base_stats.int;
			intSum += character.bonus_stats.int;
			bonusHitSum += character.bonus_attributes.hit;

			//calculate Hit [(DEX*3) + (INT*0.5) + bonus]
			characterHit = (dexSum*3) + (intSum*0.5) + bonusHitSum;

			character.final_attributes.hit = Math.ceil(characterHit);

		break;

		case "all":

			calculateCharacterAttr(character, "hp");
			calculateCharacterAttr(character, "def");
			calculateCharacterAttr(character, "mdef");
			calculateCharacterAttr(character, "eva");
			calculateCharacterAttr(character, "atk");
			calculateCharacterAttr(character, "matk");
			calculateCharacterAttr(character, "aspd");
			calculateCharacterAttr(character, "cspd");
			calculateCharacterAttr(character, "hit");

		break;

		default:
		break;
	}
}