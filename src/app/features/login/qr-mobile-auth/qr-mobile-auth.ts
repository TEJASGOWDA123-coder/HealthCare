import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-qr-mobile-auth',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './qr-mobile-auth.html',
    styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #f8fafc;
    }
  `
})
export class QrMobileAuth implements OnInit {
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private platformId = inject(PLATFORM_ID);

    protected sessionId = signal<string | null>(null);
    protected isAuthorizing = signal<boolean>(false);
    protected isSuccess = signal<boolean>(false);
    protected error = signal<string | null>(null);

    ngOnInit() {
        this.sessionId.set(this.route.snapshot.queryParamMap.get('s'));
        if (!this.sessionId()) {
            this.error.set('Invalid request. No session ID found.');
        }
    }

    protected confirmLogin() {
        if (!this.sessionId()) return;

        this.isAuthorizing.set(true);
        this.error.set(null);

        // In a real app, we'd get the token from the mobile app's storage.
        // For this simulation/demo, we'll use the user's current token 
        // or simulate one if they are testing directly on the phone.
        let token = 'SIMULATED_MOBILE_TOKEN';
        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('auth_token') || token;
        }

        this.http.post<any>(`${environment.apiBaseUrl}/auth/qr/authorize`, {
            sessionId: this.sessionId(),
            mobileToken: token
        }).subscribe({
            next: (res) => {
                this.isAuthorizing.set(false);
                if (res.status === 'SUCCESS') {
                    this.isSuccess.set(true);
                } else {
                    this.error.set(res.message || 'Authorization failed.');
                }
            },
            error: (err) => {
                console.error('Authorization failed', err);
                this.isAuthorizing.set(false);
                this.error.set('Failed to connect to the authorization server.');
            }
        });
    }
}
