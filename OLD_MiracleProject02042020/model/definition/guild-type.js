/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('GuildType', {
    guildTypeId: {
        type: DataTypes.INTEGER,
        field: 'guild_type_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    name: {
        type: DataTypes.STRING(64),
        field: 'name',
        allowNull: false}}, {
        schema: 'public',
        tableName: 'guild_type',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const GuildType = model.GuildType;const Guild = model.Guild;
    

    
        
        GuildType.hasMany(Guild, {
        as        : 'GuildFk0s',
        foreignKey: 'guild_type_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
