//Character object
/*
	NPCs will have a race and a class. This is the object to be used as a character.
	NPCs will have a name, race and class (tier 0)
*/

function createNewCharacter(charName, charLevel){

	var character = {};

	character.name = charName;

	character.race = getRandomRace();

	character.class = getRandomClass(0, character.race);

	character.level = charLevel;

	character.unusedStatPoints = character.level == 1 ? 0:Math.ceil((Level*0.25)+5);

	character.stats = {
		str: character.class.main_stat == "str" ? getRandomNumber(5,9):getRandomNumber(2,5),
		agi: character.class.main_stat == "agi" ? getRandomNumber(5,9):getRandomNumber(2,5),
		vit: character.class.main_stat == "vit" ? getRandomNumber(5,9):getRandomNumber(2,5),
		int: character.class.main_stat == "int" ? getRandomNumber(5,9):getRandomNumber(2,5),
		dex: character.class.main_stat == "dex" ? getRandomNumber(5,9):getRandomNumber(2,5),
		luk: character.class.main_stat == "luk" ? getRandomNumber(5,9):getRandomNumber(2,5),
	};

	randomAllocateStatsPoints(character);

	character.base_attributes= {
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

	return sys_races[Object.keys(sys_races)[getRandomNumber(0,Object.keys(sys_races).length)]];
}

function getRandomClass(tier, race){

	return race.classes['classes_'+tier][Object.keys(race.classes['classes_'+tier])[getRandomNumber(0,Object.keys(race.classes['classes_'+tier]).length)]];
}

function randomAllocateStatsPoints(character){

	//allocate main stat first (20% min 50% max of total)
	var mainStatAllocationQty = getRandomNumber(Math.floor(character.unusedStatPoints*0.2), Math.floor(character.unusedStatPoints*0.5));
	character.stats[character.class.main_stat] += mainStatAllocationQty;
	character.unusedStatPoints -= mainStatAllocationQty;

	//allocate randomly min 1 max 20%
	var count = 0;
	var statsList = ["agi", "vit", "int", "dex", "luk"];
	while(character.unusedStatPoints > 0){

		var allocation = getRandomNumber(1, Math.floor(character.unusedStatPoints*0.2));
		character.stats[statsList[count]] += allocation;
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

		

		break;

		case "def":
		break;

		case "mdef":
		break;

		case "eva":
		break;

		case "atk":
		break;

		case "matk":
		break;

		case "aspd":
		break;

		case "cspd":
		break;

		case "hit":
		break;

		default:
		break;
	}
}