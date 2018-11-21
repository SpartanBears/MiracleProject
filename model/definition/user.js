/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false,primaryKey: true
        ,autoIncrement: true
        },
    loginUser: {
        type: DataTypes.STRING(32),
        field: 'login_user',
        allowNull: false},
    loginPwd: {
        type: DataTypes.STRING(128),
        field: 'login_pwd',
        allowNull: false},
    username: {
        type: DataTypes.STRING(32),
        field: 'username',
        allowNull: false}}, {
        schema: 'public',
        tableName: 'user',
        timestamps: false});
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const model = require('../index');
    const User = model.User;const God = model.God;
    

    
        
        User.hasMany(God, {
        as        : 'GodFk0s',
        foreignKey: 'user_id', 
    onDelete  : 'NO ACTION',
    onUpdate  : 'NO ACTION'
    });

};
