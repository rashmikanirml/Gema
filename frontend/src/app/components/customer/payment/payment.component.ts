import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  booking: any;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';
  paymentMethods = ['card', 'bank_transfer', 'wallet'];

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

    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.loadBooking(parseInt(bookingId));
    }

    this.initForm();
  }

  initForm(): void {
    this.paymentForm = this.formBuilder.group({
      paymentMethod: ['card', [Validators.required]]
    });
  }

  get f() { return this.paymentForm.controls; }

  loadBooking(bookingId: number): void {
    this.bookingService.getBookingById(bookingId).subscribe(
      (response: any) => {
        this.booking = response;
      },
      (error) => {
        this.error = 'Failed to load booking details';
      }
    );
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    if (this.paymentForm.invalid || !this.booking) {
      return;
    }

    this.loading = true;

    const paymentData = {
      bookingId: this.booking.id,
      amount: this.booking.total_amount,
      paymentMethod: this.f['paymentMethod'].value
    };

    this.bookingService.processPayment(paymentData).subscribe(
      (response: any) => {
        this.successMessage = '✓ Payment processed successfully! Your booking is confirmed.';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 2000);
      },
      (error: any) => {
        this.error = error.error?.error || 'Payment processing failed';
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'card': '💳 Credit/Debit Card',
      'bank_transfer': '🏦 Bank Transfer',
      'wallet': '💼 E-Wallet'
    };
    return labels[method] || method;
  }
}
