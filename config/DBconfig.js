var Sequelize = require('sequelize');
var conf = require('./dbcred.json');

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);

  // Z here means current timezone, _not_ UTC
  // return date.format('YYYY-MM-DD HH:mm:ss.SSS Z');
  return date.format('YYYY-MM-DD HH:mm:ss');
};

var sequelize = new Sequelize(conf.postgres.database, conf.postgres.user, conf.postgres.pass, {
    host: conf.postgres.host,
    timezone: '00:00',
    dialect: conf.postgres.dialect,
    pool: {
        max: 130,
        min: 10,
        idle: 180000,
        evict: 180000,
        acquire: 180000
    }
});

module.exports = sequelize;