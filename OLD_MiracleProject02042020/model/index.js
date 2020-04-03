/* eslint global-require: "off" */
const model     = {};
let initialized = false;

/**
* Initializes sequelize models and their relations.
* @param   {Object} sequelize  - Sequelize instance.
* @returns {Object}            - Sequelize models.
*/
function init(sequelize) {
  
    delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
    initialized = true;
    // Import model files and assign them to `model` object.
    model.Adventurer = sequelize.import('./definition/adventurer.js');
        model.Familium = sequelize.import('./definition/familia.js');
        model.God = sequelize.import('./definition/god.js');
        model.Guild = sequelize.import('./definition/guild.js');
        model.GuildFamilium = sequelize.import('./definition/guild-familia.js');
        model.GuildType = sequelize.import('./definition/guild-type.js');
        model.User = sequelize.import('./definition/user.js');
        

    // All models are initialized. Now connect them with relations.
    require('./definition/adventurer.js').initRelations();
       require('./definition/familia.js').initRelations();
       require('./definition/god.js').initRelations();
       require('./definition/guild.js').initRelations();
       require('./definition/guild-familia.js').initRelations();
       require('./definition/guild-type.js').initRelations();
       require('./definition/user.js').initRelations();
       return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
