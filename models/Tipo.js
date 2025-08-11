const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Tipo = sequelize.define('Tipo', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Tipo;