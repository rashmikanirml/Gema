import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  packages: any[] = [];
  destinations: any[] = [];
  filteredPackages: any[] = [];
  loading = false;
  error = '';

  // Filter options
  selectedDestination = '';
  maxBudget = 10000;
  minDuration = 1;
  maxDuration = 30;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDestinations();
    this.loadPackages();
  }

  loadDestinations(): void {
    this.bookingService.getDestinations().subscribe(
      (response: any) => {
        this.destinations = response.destinations || [];
      },
      (error: any) => {
        console.error('Error loading destinations:', error);
      }
    );
  }

  loadPackages(): void {
    this.loading = true;
    this.bookingService.getPackages().subscribe(
      (response: any) => {
        this.packages = response.packages || [];
        this.filteredPackages = [...this.packages];
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Failed to load packages';
        this.loading = false;
      }
    );
  }

  searchPackages(): void {
    const filters: any = {
      budget: this.maxBudget
    };

    if (this.selectedDestination) {
      filters.destinationId = this.selectedDestination;
    }

    if (this.minDuration > 1 || this.maxDuration < 30) {
      filters.durationFrom = this.minDuration;
      filters.durationTo = this.maxDuration;
    }

    this.loading = true;
    this.bookingService.searchPackages(filters).subscribe(
      (response: any) => {
        this.filteredPackages = response.packages || [];
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Search failed';
        this.loading = false;
      }
    );
  }

  resetFilters(): void {
    this.selectedDestination = '';
    this.maxBudget = 10000;
    this.minDuration = 1;
    this.maxDuration = 30;
    this.loadPackages();
  }

  viewPackageDetails(packageId: number): void {
    this.router.navigate(['/package-details', packageId]);
  }

  bookPackage(packageId: number): void {
    this.router.navigate(['/booking-form', packageId]);
  }

  viewMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
