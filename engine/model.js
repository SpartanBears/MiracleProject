var sequelize = require("../config/DBconfig.js");
var model = require("../model/index.js").init(sequelize);

var SHA256 = require("crypto-js/sha256");

module.exports = {

	createUser: createUser,

};

function createUser(newLogin_user, newLogin_pwd, newUsername){

	var passHash = SHA256(newLogin_pwd).toString();

	return new Promise(function(resolve, reject){

		var newUser = model.User.create({loginUser:newLogin_user, loginPwd:passHash, username:newUsername}).then(function(user){

			var savedUser = {login_user:user.loginUser, login_pwd:user.loginPwd, username:user.username};

			resolve(savedUser);
			
		});
	});
}


