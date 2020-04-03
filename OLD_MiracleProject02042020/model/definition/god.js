/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('God', {
    godId: {
        type: DataTypes.INTEGER,
        field: 'god_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false,references: { model: 'user', key: 'user_id' }
        ,onUpdate: 'NO ACTION'
        ,onDelete: 'NO ACTION'
        },
    name: {
        type: DataTypes.STRING(64),
        field: 'name',
        allowNull: false},
    desc: {
        type: DataTypes.STRING(512),
        field: 'desc',
        allowNull: true}}, {
        schema: 'public',
        tableName: 'god',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const God = model.God;const Familium = model.Familium;
    const User = model.User;
    

    
        
        God.hasMany(Familium, {
        as        : 'FamiliaFk0s',
        foreignKey: 'god_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });


    God.belongsTo(User, {
    as        : 'User',
    foreignKey: 'user_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
