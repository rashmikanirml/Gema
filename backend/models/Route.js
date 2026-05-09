const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  start_location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  end_location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  distance_km: {
    type: DataTypes.DECIMAL(10, 2)
  },
  estimated_hours: {
    type: DataTypes.DECIMAL(5, 2)
  }
}, {
  tableName: 'routes',
  timestamps: true,
  underscored: true
});

module.exports = Route;
