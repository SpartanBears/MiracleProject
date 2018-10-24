//Character object
/*
	NPCs will have a race and a class. This is the object to be used as a character.
	NPCs will have a name, race and class (tier 0)
*/

function createNewCharacter(charName){

	var character = {};
	character.name = charName;
	character.race = getRandomRace();
	character.class = getRandomClass(0, character.race);
		

	return character;
}

function getRandomRace(){

	return sys_races[Object.keys(sys_races)[getRandomNumber(0,Object.keys(sys_races).length)]];
}

function getRandomClass(tier, race){

	return race.classes['classes_'+tier][Object.keys(race.classes['classes_'+tier])[getRandomNumber(0,Object.keys(race.classes['classes_'+tier]).length)]];
}