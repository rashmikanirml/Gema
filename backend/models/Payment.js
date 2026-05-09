const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Booking = require('./Booking');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  transaction_id: {
    type: DataTypes.STRING(255)
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'bank_transfer', 'wallet'),
    defaultValue: 'card'
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

module.exports = Payment;
