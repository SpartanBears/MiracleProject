/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Familium', {
    familiaId: {
        type: DataTypes.INTEGER,
        field: 'familia_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    godId: {
        type: DataTypes.INTEGER,
        field: 'god_id',
        allowNull: false,references: { model: 'god', key: 'god_id' }
        ,onUpdate: 'NO ACTION'
        ,onDelete: 'NO ACTION'
        },
    name: {
        type: DataTypes.STRING(64),
        field: 'name',
        allowNull: false}}, {
        schema: 'public',
        tableName: 'familia',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const Familium = model.Familium;const Adventurer = model.Adventurer;
    const GuildFamilium = model.GuildFamilium;
    const God = model.God;
    const Guild = model.Guild;
    

    
        
        Familium.hasMany(Adventurer, {
        as        : 'AdventurerFk0s',
        foreignKey: 'familia_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


        
        Familium.hasMany(GuildFamilium, {
        as        : 'GuildFamiliaFk0s',
        foreignKey: 'familia_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    Familium.belongsTo(God, {
    as        : 'God',
    foreignKey: 'god_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    Familium.belongsToMany(Guild, {
    as        : 'GuildFamiliumGuilds',
    through   : GuildFamilium,
    foreignKey: 'familia_id', 
    otherKey  : 'guild_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
