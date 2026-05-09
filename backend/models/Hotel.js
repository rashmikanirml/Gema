const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Destination = require('./Destination');

const Hotel = sequelize.define('Hotel', {
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
  address: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING(500)
  },
  total_rooms: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'hotels',
  timestamps: true,
  underscored: true
});

Hotel.belongsTo(Destination, { foreignKey: 'destination_id', as: 'destination' });

module.exports = Hotel;
