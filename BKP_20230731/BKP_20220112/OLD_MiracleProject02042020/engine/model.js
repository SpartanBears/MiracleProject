var sequelize = require("../config/DBconfig.js");
var Sequelize = require("sequelize");
var model = require("../model/index.js").init(sequelize);
var CharBase = require("./char_base.js");
var EngineTools = require("./engine_tools.js");

var SHA256 = require("crypto-js/sha256");

module.exports = {
	

	
	//testing
	createUserTest: createUserTest,
	createGodTest: createGodTest,
	createFamiliaTest: createFamiliaTest,
	createAdventurersTest: createAdventurersTest,
	createGuildTest: createGuildTest,

};

function createUserTest(newLogin_user, newLogin_pwd, newUsername){

	var passHash = SHA256(newLogin_pwd).toString();

	return new Promise(function(resolve, reject){

		var newUser = model.User.create({loginUser:newLogin_user, loginPwd:passHash, username:newUsername}).then(function(user){

			//var savedUser = {login_user:user.loginUser, login_pwd:user.loginPwd, username:user.username};

			resolve(user);

		}).catch(Sequelize.UniqueConstraintError, function(err){

			resolve({error:"Login User or Username already exists"});
		});
	});
}

function createGodTest(newName, newDesc){

	var tempTS = new Date().getTime();

	return new Promise(function(resolve, reject){

		//creates user first then god
		sequelize.transaction(function(t){

			return model.User.create({loginUser:"user_"+tempTS, loginPwd:SHA256("pwd_"+tempTS).toString(), username:"username_"+tempTS}, {transaction:t}).then(function(user){

				return model.God.create({userId:user.userId, name:newName, desc:newDesc}, {transaction:t});

			});

		}).then(function(result){

			resolve(result);
		});
	});
}

function createFamiliaTest(newName){

	var tempTS = new Date().getTime();

	//user -> god -> familia

	return new Promise(function(resolve, reject){

		sequelize.transaction(function(t){

			return model.User.create({loginUser:"user_"+newName, loginPwd:SHA256("pwd_"+tempTS).toString(), username:"username_"+tempTS}, {transaction:t}).then(function(user){

				return model.God.create({userId:user.userId, name:"name_"+tempTS, desc:"desc_"+tempTS}, {transaction:t}).then(function(god){

					return model.Familium.create({godId:god.godId, name:newName}, {transaction:t});
				});

			});

		}).then(function(result){

			resolve(result);
		});

	});
	
}

function createAdventurerTest(name, level, familiaId){

	var tempTS = new Date().getTime();

	var newAdventurer = CharBase.createNewCharacter(name+tempTS, level);

	return new Promise(function(resolve, reject){

		model.Adventurer.create({familiaId:familiaId, json:JSON.stringify(newAdventurer)}).then(function(adventurer){

			resolve(adventurer);
		});

	});
}

//creates a user, god, familia and its adventurers
function createAdventurersTest(namePool){

	var tempTS = new Date().getTime()+ Math.floor(new Date().getTime()/100000);

	return new Promise(function(resolve, reject){

		sequelize.transaction(function(t){

			return model.User.create({loginUser:"user_"+tempTS, loginPwd:SHA256("pwd_"+tempTS).toString(), username:"username_"+tempTS}, {transaction:t}).then(function(user){

				return model.God.create({userId:user.userId, name:"name_"+tempTS, desc:"desc_"+tempTS}, {transaction:t}).then(function(god){

					return model.Familium.create({godId:god.godId, name:"familia_"+tempTS}, {transaction:t}).then(function(familia){

						var adventurerPromises = []

						for(var index = 0; index < namePool.length; index++){

							var newAdventurer = CharBase.createNewCharacter(namePool[index]+tempTS, EngineTools.getRandomNumber(10,57));

							adventurerPromises[index] = model.Adventurer.create({familiaId:familia.familiaId, json:JSON.stringify(newAdventurer)},{transaction:t});
						}

						return Promise.all(adventurerPromises);
					});
				});

			});

		}).then(function(result){

			resolve(result);
		});

	});
}

//creates users, gods, familias, adventurers and groups them in a new clan
function createGuildTest(guildName){

	var tempTS = new Date().getTime()+ Math.floor(new Date().getTime()/100000);

	//cycles on createAdventurersTest to create users, gods, familias and adventurers
	var createAdventurerPromises = [];

	var adventurerNamePool = ["RA1", "RA2", "RA3"];

	var familiaId;

	return new Promise(function(resolve, reject){

		sequelize.transaction(function(t){

			return model.User.create({loginUser:"user_"+tempTS, loginPwd:SHA256("pwd_"+tempTS).toString(), username:"username_"+tempTS}, {transaction:t}).then(function(user){

				tempTS = new Date().getTime();

				return model.God.create({userId:user.userId, name:"name_"+tempTS, desc:"desc_"+tempTS}, {transaction:t}).then(function(god){

					tempTS = new Date().getTime();

					return model.Familium.create({godId:god.godId, name:"familia_"+tempTS}, {transaction:t}).then(function(familia){

						tempTS = new Date().getTime();

						familiaId = familia.familiaId;

						var adventurerPromises = [];

						for(var index = 0; index < adventurerNamePool.length; index++){

							var newAdventurer = CharBase.createNewCharacter(adventurerNamePool[index]+tempTS, EngineTools.getRandomNumber(10,57));

							adventurerPromises[index] = model.Adventurer.create({familiaId:familia.familiaId, json:JSON.stringify(newAdventurer)},{transaction:t});
						}

						return Promise.all(adventurerPromises).then(function(){

							tempTS = new Date().getTime();

							return model.GuildType.create({name:"guildType_"+tempTS}, {transaction:t}).then(function(guildType){

								return model.Guild.create({name:guildName, guildTypeId:guildType.guildTypeId}, {transaction:t}).then(function(guild){

									return model.GuildFamilium.create({familiaId:familiaId, guildId:guild.guildId},{transaction:t});
								});
							});
						});
					});
				});

			});

		}).then(function(result){

			resolve(result);
		});
	});
}


