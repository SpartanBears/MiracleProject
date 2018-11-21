/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Adventurer', {
    adventurerId: {
        type: DataTypes.INTEGER,
        field: 'adventurer_id',
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
    json: {
        type: DataTypes.STRING(1024),
        field: 'json',
        allowNull: false}}, {
        schema: 'public',
        tableName: 'adventurer',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const Adventurer = model.Adventurer;const Familium = model.Familium;
    

    
    Adventurer.belongsTo(Familium, {
    as        : 'Familium',
    foreignKey: 'familia_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
