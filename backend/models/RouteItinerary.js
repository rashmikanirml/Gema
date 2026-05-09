const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Route = require('./Route');

const RouteItinerary = sequelize.define('RouteItinerary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'id'
    }
  },
  day_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  place_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  duration_hours: {
    type: DataTypes.DECIMAL(5, 2)
  }
}, {
  tableName: 'route_itineraries',
  timestamps: true,
  underscored: true
});

RouteItinerary.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

module.exports = RouteItinerary;
