import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Will be replaced with environment variable
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  private tokenKey = 'gema_token';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.currentUserSubject.next(response.user);
            localStorage.setItem('gema_user', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.currentUserSubject.next(response.user);
            localStorage.setItem('gema_user', JSON.stringify(response.user));
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('gema_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getStoredUser(): any {
    const userJson = localStorage.getItem('gema_user');
    return userJson ? JSON.parse(userJson) : null;
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
