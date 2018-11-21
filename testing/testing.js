var Engine = require("../engine/engine.js");

module.exports = {

	runTest: function(testID, data, io, userSocket){

		var testReturn = "";

		switch(testID){

			case "randomChars":

				//data
				//{names:[string]}

				testReturn = randomCharacterCreation(data);

				io.to(userSocket).emit(testID+" SUCCESS", {return: testReturn});

			break;

			case "createUser":

				//data
				//{user:string, pwd:string, username:string}

				testReturn = createUser(data);
				testReturn.then(function(user){
					io.to(userSocket).emit(testID+" SUCCESS", {return: user});
				});

			break;

			default:
			break;
		}

	},

};

function randomCharacterCreation(namePool){

	var characters = [];

	while(namePool.length > 0){

		characters.push(Engine.CharBase.createNewCharacter(namePool.pop(), Engine.EngineTools.getRandomNumber(10,57)));
	}

	return characters;
}

function createUser(userData){

	return Engine.Model.createUser(userData.user, userData.pwd, userData.username);
}