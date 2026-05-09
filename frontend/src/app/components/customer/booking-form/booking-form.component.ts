import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  pkg: any;
  currentUser: any;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    const packageId = this.route.snapshot.paramMap.get('id');
    if (packageId) {
      this.loadPackage(parseInt(packageId));
    }

    this.initForm();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.bookingForm = this.formBuilder.group({
      numberOfGuests: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      checkInDate: [today, [Validators.required]],
      checkOutDate: [today, [Validators.required]]
    });
  }

  get f() { return this.bookingForm.controls; }

  loadPackage(packageId: number): void {
    this.bookingService.getPackageById(packageId).subscribe(
      (response: any) => {
        this.pkg = response;
      },
      (error: any) => {
        this.error = 'Failed to load package details';
      }
    );
  }

  calculateTotalDays(): number {
    if (!this.f['checkInDate'].value || !this.f['checkOutDate'].value) {
      return 0;
    }

    const checkIn = new Date(this.f['checkInDate'].value);
    const checkOut = new Date(this.f['checkOutDate'].value);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  }

  calculateTotalPrice(): number {
    if (!this.pkg) return 0;
    const days = this.calculateTotalDays();
    return days * this.pkg.price_per_day;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    if (this.bookingForm.invalid || !this.pkg) {
      return;
    }

    // Validate date range
    const checkIn = new Date(this.f['checkInDate'].value);
    const checkOut = new Date(this.f['checkOutDate'].value);

    if (checkOut <= checkIn) {
      this.error = 'Check-out date must be after check-in date';
      return;
    }

    this.loading = true;

    const bookingData = {
      packageId: this.pkg.id,
      checkInDate: this.f['checkInDate'].value,
      checkOutDate: this.f['checkOutDate'].value,
      numberOfGuests: this.f['numberOfGuests'].value
    };

    this.bookingService.createBooking(bookingData).subscribe(
      (response: any) => {
        this.successMessage = 'Booking created successfully! Redirecting to payment...';
        this.loading = false;
        
        // Redirect to payment after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/payment', response.booking.id]);
        }, 2000);
      },
      (error: any) => {
        this.error = error.error?.error || 'Failed to create booking';
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
