const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Destination = require('./Destination');
const Hotel = require('./Hotel');
const Vehicle = require('./Vehicle');
const Route = require('./Route');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  destination_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'destinations',
      key: 'id'
    }
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotels',
      key: 'id'
    }
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'id'
    }
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  price_per_day: {
    type: DataTypes.DECIMAL(10, 2)
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING(500)
  },
  available_slots: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  }
}, {
  tableName: 'packages',
  timestamps: true,
  underscored: true
});

Package.belongsTo(Destination, { foreignKey: 'destination_id', as: 'destination' });
Package.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
Package.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
Package.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

module.exports = Package;
