import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, Role, User } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private api = 'http://localhost:8080/auth/login';
    private platformId = inject(PLATFORM_ID);
    currentUser = signal<User | null>(this.getStoredUser());
    private router = inject(Router);

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(this.api, { email, password }).pipe(
            tap(response => this.saveToken(response.token, response.user, response.role))
        );
    }

    saveToken(token: string, user?: User, role?: Role) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', token);

            let finalUser = user;
            if (!finalUser && role) {
                finalUser = { id: 0, name: 'User', email: '', role };
            }

            if (finalUser) {
                localStorage.setItem('user', JSON.stringify(finalUser));
                localStorage.setItem('role', finalUser.role);
                this.currentUser.set(finalUser);
            }
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
        }
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    hasRole(roles: Role[]): boolean {
        const user = this.currentUser();
        if (!user || !user.role) return false;
        return roles.some(r => r.toLowerCase() === user.role.toLowerCase());
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    private getStoredUser(): User | null {
        if (isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('user');

            if (userStr && userStr !== 'undefined' && userStr !== 'null') {
                try {
                    return JSON.parse(userStr);
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            }

            const role = localStorage.getItem('role') as Role;
            if (role) {
                return { id: 0, name: 'User', email: '', role };
            }
        }
        return null;
    }
}
