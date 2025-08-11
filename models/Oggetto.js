const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Tipo = require('./Tipo');

const Oggetto = sequelize.define('Oggetto', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

// Associazione: Oggetto appartiene solo a Tipo (l'area è derivabile dal tipo)
Oggetto.belongsTo(Tipo, { foreignKey: 'tipoId' });

module.exports = Oggetto;