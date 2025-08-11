const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Area = require('./Area');
const Tipo = require('./Tipo');

const Oggetto = sequelize.define('Oggetto', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

Oggetto.belongsTo(Area, { foreignKey: 'areaId' });
Oggetto.belongsTo(Tipo, { foreignKey: 'tipoId' });

module.exports = Oggetto;