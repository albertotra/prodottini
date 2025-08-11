const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Area = sequelize.define('Area', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Area;