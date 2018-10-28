var Engine = require("../engine/engine.js");

module.exports = {

	runTest: function(testID, data, io, userSocket){

		var testReturn = "";

		switch(testID){

			case "randomChars":

				testReturn = randomCharacterCreation(data);

			break;

			default:
			break;
		}

		io.to(userSocket).emit(testID+" SUCCESS", {return: testReturn});
	},

};

function randomCharacterCreation(namePool){

	var characters = [];

	while(namePool.length > 0){

		characters.push(Engine.CharBase.createNewCharacter(namePool.pop(), Engine.EngineTools.getRandomNumber(10,57)));
	}

	return characters;
}