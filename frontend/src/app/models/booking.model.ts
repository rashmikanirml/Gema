export interface Destination {
  id: number;
  name: string;
  description: string;
  country: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hotel {
  id: number;
  name: string;
  destination_id: number;
  address: string;
  rating: number;
  price_per_night: number;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: number;
  name: string;
  type: string; // 'car', 'van', 'bus', etc.
  capacity: number;
  price_per_day: number;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: number;
  name: string;
  description: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  estimated_hours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteItinerary {
  id: number;
  route_id: number;
  day_number: number;
  place_name: string;
  latitude: number;
  longitude: number;
  description?: string;
  duration_hours?: number;
}

export interface Package {
  id: number;
  name: string;
  destination_id: number;
  hotel_id: number;
  vehicle_id: number;
  route_id: number;
  duration_days: number;
  total_price: number;
  price_per_day?: number;
  description?: string;
  image?: string;
  available_slots: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: number;
  customer_id: number;
  package_id: number;
  check_in_date: Date;
  check_out_date: Date;
  number_of_guests: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  createdAt: Date;
  updatedAt: Date;
}
