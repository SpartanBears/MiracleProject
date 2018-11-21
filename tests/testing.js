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

			case "createGod":

				//data
				//{name:string, desc:string}

				testReturn = createGod(data);
				testReturn.then(function(god){
					io.to(userSocket).emit(testID+" SUCCESS", {return: god});
				});

			break;

			case "createFamilia":

				//data
				//{name:string}

				testReturn = createFamilia(data);
				testReturn.then(function(familia){
					io.to(userSocket).emit(testID+" SUCCESS", {return: familia});
				});

			break;

			case "createAdventurers":

				//data
				//{names:[string]}

				testReturn = createAdventurers(data);
				testReturn.then(function(result){
					io.to(userSocket).emit(testID+" SUCCESS", {return: result});
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

	return Engine.Model.createUserTest(userData.user, userData.pwd, userData.username);
}

function createGod(userData){

	return Engine.Model.createGodTest(userData.godName, userData.desc);
}

function createFamilia(userData){

	return Engine.Model.createFamiliaTest(userData.familiaName);
}

function createAdventurers(namePool){

	return Engine.Model.createAdventurersTest(namePool);
}