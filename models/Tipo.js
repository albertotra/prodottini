const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Area = require('./Area');

const Tipo = sequelize.define('Tipo', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

// Associazione: Tipo appartiene a Area
Tipo.belongsTo(Area, { foreignKey: 'areaId' });

module.exports = Tipo;