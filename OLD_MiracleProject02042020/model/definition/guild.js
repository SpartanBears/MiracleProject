/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Guild', {
    guildId: {
        type: DataTypes.INTEGER,
        field: 'guild_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    name: {
        type: DataTypes.STRING(64),
        field: 'name',
        allowNull: false},
    guildTypeId: {
        type: DataTypes.INTEGER,
        field: 'guild_type_id',
        allowNull: false,references: { model: 'guild_type', key: 'guild_type_id' }
        ,onUpdate: 'NO ACTION'
        ,onDelete: 'NO ACTION'
        }}, {
        schema: 'public',
        tableName: 'guild',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const Guild = model.Guild;const GuildFamilium = model.GuildFamilium;
    const GuildType = model.GuildType;
    const Familium = model.Familium;
    

    
        
        Guild.hasMany(GuildFamilium, {
        as        : 'FamiliaFk1s',
        foreignKey: 'guild_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    Guild.belongsTo(GuildType, {
    as        : 'GuildType',
    foreignKey: 'guild_type_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    Guild.belongsToMany(Familium, {
    as        : 'GuildFamiliumFamilia',
    through   : GuildFamilium,
    foreignKey: 'guild_id', 
    otherKey  : 'familia_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
