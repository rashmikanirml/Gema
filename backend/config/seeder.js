const bcryptjs = require('bcryptjs');
const models = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Drop and recreate tables (only for development)
    await models.sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('✅ Database tables synchronized');

    // Seed Roles
    const adminRole = await models.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { description: 'Administrator with full access' }
    });

    const userRole = await models.Role.findOrCreate({
      where: { name: 'user' },
      defaults: { description: 'Service provider (hotel/vehicle operator)' }
    });

    const customerRole = await models.Role.findOrCreate({
      where: { name: 'customer' },
      defaults: { description: 'Tourist/customer who books packages' }
    });

    console.log('✅ Roles seeded');

    // Seed Admin User
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    await models.User.findOrCreate({
      where: { email: 'admin@gema.local' },
      defaults: {
        email: 'admin@gema.local',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'Gema',
        phone: '+1234567890',
        role_id: adminRole[0].id,
        is_active: true
      }
    });
    console.log('✅ Admin user seeded');

    // Seed Destinations
    const destinations = await models.Destination.bulkCreate([
      {
        name: 'Bangkok',
        description: 'The bustling capital of Thailand with temples and markets',
        country: 'Thailand',
        latitude: 13.7563,
        longitude: 100.5018,
        image: '/assets/destinations/bangkok.jpg'
      },
      {
        name: 'Phuket',
        description: 'Beautiful beaches and tropical islands in southern Thailand',
        country: 'Thailand',
        latitude: 8.0863,
        longitude: 98.3077,
        image: '/assets/destinations/phuket.jpg'
      },
      {
        name: 'Chiang Mai',
        description: 'Cultural heart of Thailand with ancient temples and mountains',
        country: 'Thailand',
        latitude: 18.7883,
        longitude: 98.9853,
        image: '/assets/destinations/chiangmai.jpg'
      },
      {
        name: 'Krabi',
        description: 'Stunning limestone cliffs and pristine beaches',
        country: 'Thailand',
        latitude: 8.3731,
        longitude: 98.9269,
        image: '/assets/destinations/krabi.jpg'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Destinations seeded');

    // Seed Hotels for Bangkok
    const bangkokHotels = await models.Hotel.bulkCreate([
      {
        name: 'Grand Palace Hotel',
        destination_id: destinations[0].id,
        address: '123 Maharaj Road, Bangkok',
        rating: 4.5,
        price_per_night: 120.00,
        description: 'Luxury hotel near Grand Palace with stunning views',
        total_rooms: 150
      },
      {
        name: 'Budget Bangkok Inn',
        destination_id: destinations[0].id,
        address: '456 Khao San Road, Bangkok',
        rating: 3.8,
        price_per_night: 45.00,
        description: 'Affordable backpacker-friendly hotel',
        total_rooms: 80
      }
    ], { ignoreDuplicates: true });

    // Seed Hotels for Phuket
    const phuketHotels = await models.Hotel.bulkCreate([
      {
        name: 'Phuket Beach Resort',
        destination_id: destinations[1].id,
        address: 'Patong Beach, Phuket',
        rating: 4.7,
        price_per_night: 150.00,
        description: 'Beachfront resort with water sports',
        total_rooms: 200
      },
      {
        name: 'Phuket City Hotel',
        destination_id: destinations[1].id,
        address: 'Phuket City, Phuket',
        rating: 3.9,
        price_per_night: 65.00,
        description: 'City center hotel with good amenities',
        total_rooms: 120
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Hotels seeded');

    // Seed Vehicles
    const vehicles = await models.Vehicle.bulkCreate([
      {
        name: 'Toyota Camry',
        type: 'car',
        capacity: 5,
        price_per_day: 50.00,
        description: 'Comfortable sedan for 5 passengers',
        registration_number: 'BKK-001'
      },
      {
        name: 'Ford Transit Van',
        type: 'van',
        capacity: 12,
        price_per_day: 80.00,
        description: 'Spacious van perfect for group tours',
        registration_number: 'BKK-002'
      },
      {
        name: 'Luxury SUV',
        type: 'suv',
        capacity: 7,
        price_per_day: 100.00,
        description: 'Premium SUV with air conditioning',
        registration_number: 'BKK-003'
      },
      {
        name: 'Tour Bus',
        type: 'bus',
        capacity: 40,
        price_per_day: 200.00,
        description: 'Large bus for group tours',
        registration_number: 'BKK-004'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Vehicles seeded');

    // Seed Routes
    const routes = await models.Route.bulkCreate([
      {
        name: 'Bangkok City Tour',
        description: 'Complete tour of Bangkok temples and markets',
        start_location: 'Bangkok Hotel',
        end_location: 'Bangkok Hotel',
        distance_km: 50.00,
        estimated_hours: 8.00
      },
      {
        name: 'Phuket Island Hopping',
        description: 'Visit nearby islands with water activities',
        start_location: 'Phuket Pier',
        end_location: 'Phuket Pier',
        distance_km: 80.00,
        estimated_hours: 10.00
      },
      {
        name: 'Krabi Beach Adventure',
        description: 'Explore beautiful beaches and limestone cliffs',
        start_location: 'Krabi Hotel',
        end_location: 'Krabi Hotel',
        distance_km: 60.00,
        estimated_hours: 9.00
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Routes seeded');

    // Seed Route Itineraries
    const bangkokRoute = routes[0];
    await models.RouteItinerary.bulkCreate([
      {
        route_id: bangkokRoute.id,
        day_number: 1,
        place_name: 'Grand Palace',
        latitude: 13.6515,
        longitude: 100.4929,
        description: 'Historic royal palace with intricate architecture',
        duration_hours: 2.5
      },
      {
        route_id: bangkokRoute.id,
        day_number: 1,
        place_name: 'Wat Phra Kaew',
        latitude: 13.6507,
        longitude: 100.4917,
        description: 'Sacred temple with emerald Buddha',
        duration_hours: 2.0
      },
      {
        route_id: bangkokRoute.id,
        day_number: 1,
        place_name: 'Floating Markets',
        latitude: 13.9,
        longitude: 100.35,
        description: 'Traditional floating markets with local goods',
        duration_hours: 3.5
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Route itineraries seeded');

    // Seed Packages
    await models.Package.bulkCreate([
      {
        name: 'Bangkok 3-Day Deluxe Package',
        destination_id: destinations[0].id,
        hotel_id: bangkokHotels[0].id,
        vehicle_id: vehicles[2].id,
        route_id: routes[0].id,
        duration_days: 3,
        total_price: 450.00,
        price_per_day: 150.00,
        description: 'Luxury Bangkok tour with premium hotel and private SUV',
        available_slots: 5
      },
      {
        name: 'Phuket Beach Escape',
        destination_id: destinations[1].id,
        hotel_id: phuketHotels[0].id,
        vehicle_id: vehicles[1].id,
        route_id: routes[1].id,
        duration_days: 4,
        total_price: 800.00,
        price_per_day: 200.00,
        description: 'Beachfront resort with island hopping activities',
        available_slots: 10
      },
      {
        name: 'Bangkok Budget Explorer',
        destination_id: destinations[0].id,
        hotel_id: bangkokHotels[1].id,
        vehicle_id: vehicles[0].id,
        route_id: routes[0].id,
        duration_days: 2,
        total_price: 180.00,
        price_per_day: 90.00,
        description: 'Affordable Bangkok tour with budget hotel',
        available_slots: 15
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Packages seeded');

    console.log('🌱 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;
