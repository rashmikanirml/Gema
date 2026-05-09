import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  currentUser: any;
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadMyBookings();
  }

  loadMyBookings(): void {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe(
      (response: any) => {
        this.bookings = response.bookings || [];
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  cancelBooking(bookingId: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe(
        () => {
          this.loadMyBookings();
        },
        (error) => {
          this.error = 'Failed to cancel booking';
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  viewDetails(bookingId: number): void {
    this.router.navigate(['/booking-details', bookingId]);
  }
}
