import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Package, Destination, Hotel, Vehicle, Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Destinations
  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`)
      .pipe(catchError(this.handleError));
  }

  getDestinationById(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/destinations/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Hotels
  getHotels(destinationId?: number): Observable<Hotel[]> {
    const url = destinationId 
      ? `${this.apiUrl}/hotels?destination_id=${destinationId}`
      : `${this.apiUrl}/hotels`;
    return this.http.get<Hotel[]>(url)
      .pipe(catchError(this.handleError));
  }

  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`)
      .pipe(catchError(this.handleError));
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/vehicles/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Packages
  getPackages(filters?: any): Observable<Package[]> {
    let url = `${this.apiUrl}/packages`;
    if (filters) {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params.append(key, filters[key]);
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return this.http.get<Package[]>(url)
      .pipe(catchError(this.handleError));
  }

  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/packages/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Bookings
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`)
      .pipe(catchError(this.handleError));
  }

  createBooking(bookingData: any): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings`, bookingData)
      .pipe(catchError(this.handleError));
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/bookings/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.error || error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
