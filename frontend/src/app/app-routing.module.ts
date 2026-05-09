import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/customer/dashboard/dashboard.component';
import { BookingFormComponent } from './components/customer/booking-form/booking-form.component';
import { PaymentComponent } from './components/customer/payment/payment.component';
import { MyBookingsComponent } from './components/customer/my-bookings/my-bookings.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'booking-form/:id', component: BookingFormComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
