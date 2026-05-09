const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Destination = require('./Destination');
const Hotel = require('./Hotel');
const Vehicle = require('./Vehicle');
const Route = require('./Route');
const RouteItinerary = require('./RouteItinerary');
const Package = require('./Package');
const Booking = require('./Booking');
const Payment = require('./Payment');

// Export all models
const models = {
  sequelize,
  Role,
  User,
  Destination,
  Hotel,
  Vehicle,
  Route,
  RouteItinerary,
  Package,
  Booking,
  Payment
};

module.exports = models;
