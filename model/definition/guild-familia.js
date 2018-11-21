/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('GuildFamilium', {
    guildFamiliaId: {
        type: DataTypes.INTEGER,
        field: 'guild_familia_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    familiaId: {
        type: DataTypes.INTEGER,
        field: 'familia_id',
        allowNull: false,references: { model: 'familia', key: 'familia_id' }
        ,onUpdate: 'NO ACTION'
        ,onDelete: 'NO ACTION'
        },
    guildId: {
        type: DataTypes.INTEGER,
        field: 'guild_id',
        allowNull: false,references: { model: 'guild', key: 'guild_id' }
        ,onUpdate: 'NO ACTION'
        ,onDelete: 'NO ACTION'
        }}, {
        schema: 'public',
        tableName: 'guild_familia',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const GuildFamilium = model.GuildFamilium;const Familium = model.Familium;
    const Guild = model.Guild;
    

    
    GuildFamilium.belongsTo(Familium, {
    as        : 'Familium',
    foreignKey: 'familia_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    GuildFamilium.belongsTo(Guild, {
    as        : 'Guild',
    foreignKey: 'guild_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
