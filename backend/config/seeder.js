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
        name: 'Colombo',
        description: 'Sri Lanka's lively capital with coastal views, markets, and heritage sites',
        country: 'Sri Lanka',
        latitude: 6.9271,
        longitude: 79.8612,
        image: '/assets/destinations/colombo.jpg'
      },
      {
        name: 'Kandy',
        description: 'The cultural heart of Sri Lanka with temples, lakes, and hill-country views',
        country: 'Sri Lanka',
        latitude: 7.2906,
        longitude: 80.6337,
        image: '/assets/destinations/kandy.jpg'
      },
      {
        name: 'Galle',
        description: 'A historic southern city known for its fort, beaches, and colonial charm',
        country: 'Sri Lanka',
        latitude: 6.0535,
        longitude: 80.2210,
        image: '/assets/destinations/galle.jpg'
      },
      {
        name: 'Ella',
        description: 'A cool hill-country escape with tea estates, waterfalls, and scenic trains',
        country: 'Sri Lanka',
        latitude: 6.8667,
        longitude: 81.0466,
        image: '/assets/destinations/ella.jpg'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Destinations seeded');

    // Seed Hotels for Colombo
    const colomboHotels = await models.Hotel.bulkCreate([
      {
        name: 'Galle Face Sea View Hotel',
        destination_id: destinations[0].id,
        address: 'Galle Face, Colombo',
        rating: 4.5,
        price_per_night: 180.00,
        description: 'Luxury seafront stay with easy access to Colombo attractions',
        total_rooms: 150
      },
      {
        name: 'Cinnamon City Lodge',
        destination_id: destinations[0].id,
        address: 'Colpetty, Colombo',
        rating: 3.8,
        price_per_night: 70.00,
        description: 'Affordable city stay for budget travelers',
        total_rooms: 80
      }
    ], { ignoreDuplicates: true });

    // Seed Hotels for Kandy
    const kandyHotels = await models.Hotel.bulkCreate([
      {
        name: 'Kandy Lake Resort',
        destination_id: destinations[1].id,
        address: 'Kandy Lake, Kandy',
        rating: 4.7,
        price_per_night: 160.00,
        description: 'Relaxed resort overlooking Kandy Lake and the hills',
        total_rooms: 200
      },
      {
        name: 'Hill Country Inn',
        destination_id: destinations[1].id,
        address: 'Peradeniya Road, Kandy',
        rating: 3.9,
        price_per_night: 60.00,
        description: 'Comfortable stay close to the Temple of the Tooth',
        total_rooms: 120
      }
    ], { ignoreDuplicates: true });

    // Seed Hotels for Galle
    const galleHotels = await models.Hotel.bulkCreate([
      {
        name: 'Fort Heritage Hotel',
        destination_id: destinations[2].id,
        address: 'Galle Fort, Galle',
        rating: 4.6,
        price_per_night: 140.00,
        description: 'Boutique hotel inside the historic fort walls',
        total_rooms: 90
      },
      {
        name: 'Southern Sands Retreat',
        destination_id: destinations[2].id,
        address: 'Unawatuna, Galle',
        rating: 4.2,
        price_per_night: 95.00,
        description: 'Beachside retreat near Galle and Unawatuna',
        total_rooms: 110
      }
    ], { ignoreDuplicates: true });

    // Seed Hotels for Ella
    const ellaHotels = await models.Hotel.bulkCreate([
      {
        name: 'Ella View Point Resort',
        destination_id: destinations[3].id,
        address: 'Ella Town, Ella',
        rating: 4.8,
        price_per_night: 130.00,
        description: 'Scenic hill-country stay with mountain views',
        total_rooms: 60
      },
      {
        name: 'Tea Estate Lodge',
        destination_id: destinations[3].id,
        address: 'Wellawaya Road, Ella',
        rating: 4.1,
        price_per_night: 85.00,
        description: 'Peaceful lodge surrounded by tea plantations',
        total_rooms: 50
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Hotels seeded');

    // Seed Vehicles
    const vehicles = await models.Vehicle.bulkCreate([
      {
        name: 'Toyota Premio',
        type: 'car',
        capacity: 5,
        price_per_day: 60.00,
        description: 'Comfortable sedan for city and intercity travel',
        registration_number: 'SL-001'
      },
      {
        name: 'Toyota Hiace Van',
        type: 'van',
        capacity: 12,
        price_per_day: 95.00,
        description: 'Spacious van ideal for family or group tours',
        registration_number: 'SL-002'
      },
      {
        name: 'Luxury SUV',
        type: 'suv',
        capacity: 7,
        price_per_day: 120.00,
        description: 'Premium SUV with air conditioning and extra comfort',
        registration_number: 'SL-003'
      },
      {
        name: 'Executive Coach',
        type: 'bus',
        capacity: 40,
        price_per_day: 240.00,
        description: 'Large coach for group tours across Sri Lanka',
        registration_number: 'SL-004'
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Vehicles seeded');

    // Seed Routes
    const routes = await models.Route.bulkCreate([
      {
        name: 'Colombo Heritage Trail',
        description: 'Explore Colombo markets, temples, and seaside landmarks',
        start_location: 'Colombo Hotel',
        end_location: 'Colombo Hotel',
        distance_km: 55.00,
        estimated_hours: 8.00
      },
      {
        name: 'Kandy Cultural Circuit',
        description: 'Visit the Temple of the Tooth, lakefront, and botanical gardens',
        start_location: 'Kandy Hotel',
        end_location: 'Kandy Hotel',
        distance_km: 35.00,
        estimated_hours: 7.00
      },
      {
        name: 'Southern Coast Discovery',
        description: 'Discover Galle Fort, beaches, and coastal heritage',
        start_location: 'Galle Hotel',
        end_location: 'Galle Hotel',
        distance_km: 70.00,
        estimated_hours: 9.00
      },
      {
        name: 'Ella Scenic Loop',
        description: 'Hill-country road trip with tea estates and waterfalls',
        start_location: 'Ella Hotel',
        end_location: 'Ella Hotel',
        distance_km: 40.00,
        estimated_hours: 6.00
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Routes seeded');

    // Seed Route Itineraries
    const colomboRoute = routes[0];
    await models.RouteItinerary.bulkCreate([
      {
        route_id: colomboRoute.id,
        day_number: 1,
        place_name: 'Gangaramaya Temple',
        latitude: 6.9219,
        longitude: 79.8580,
        description: 'Iconic temple blending Sri Lankan, Thai, Indian, and Chinese architecture',
        duration_hours: 2.5
      },
      {
        route_id: colomboRoute.id,
        day_number: 1,
        place_name: 'Pettah Market',
        latitude: 6.9360,
        longitude: 79.8478,
        description: 'Bustling market district with local goods and street food',
        duration_hours: 2.0
      },
      {
        route_id: colomboRoute.id,
        day_number: 1,
        place_name: 'Galle Face Green',
        latitude: 6.9275,
        longitude: 79.8449,
        description: 'Oceanfront promenade perfect for sunset walks',
        duration_hours: 3.5
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Route itineraries seeded');

    // Seed Packages
    await models.Package.bulkCreate([
      {
        name: 'Colombo 3-Day Capital Explorer',
        destination_id: destinations[0].id,
        hotel_id: colomboHotels[0].id,
        vehicle_id: vehicles[2].id,
        route_id: routes[0].id,
        duration_days: 3,
        total_price: 540.00,
        price_per_day: 180.00,
        description: 'Luxury Colombo stay with premium hotel and private SUV',
        available_slots: 5
      },
      {
        name: 'Kandy Hill Country Escape',
        destination_id: destinations[1].id,
        hotel_id: kandyHotels[0].id,
        vehicle_id: vehicles[1].id,
        route_id: routes[1].id,
        duration_days: 4,
        total_price: 640.00,
        price_per_day: 160.00,
        description: 'Scenic hill-country package with lake views and cultural highlights',
        available_slots: 10
      },
      {
        name: 'Galle Coastal Explorer',
        destination_id: destinations[2].id,
        hotel_id: galleHotels[0].id,
        vehicle_id: vehicles[0].id,
        route_id: routes[2].id,
        duration_days: 2,
        total_price: 260.00,
        price_per_day: 130.00,
        description: 'Affordable coastal and heritage tour in southern Sri Lanka',
        available_slots: 15
      },
      {
        name: 'Ella Scenic Retreat',
        destination_id: destinations[3].id,
        hotel_id: ellaHotels[0].id,
        vehicle_id: vehicles[0].id,
        route_id: routes[3].id,
        duration_days: 3,
        total_price: 390.00,
        price_per_day: 130.00,
        description: 'Hill-country retreat with tea estates, waterfalls, and cool mountain air',
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
