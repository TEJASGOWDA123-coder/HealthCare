import { Component, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../../core/auth/auth.service';
import { interval, Subscription, switchMap, takeWhile, timer, map, take } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-qr-login',
  standalone: true,
  imports: [CommonModule, RouterModule, QRCodeComponent],
  templateUrl: './qr-login.html',
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    }
  `,
})
export class QrLogin implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  protected isBrowser = false;
  protected readonly sessionId = signal<string | null>(null);
  protected readonly targetUser = signal<string | null>(null);
  protected readonly qrData = signal<string | null>(null);
  protected readonly timeLeft = signal<number>(30);
  protected readonly isExpired = signal<boolean>(false);
  private pollingSub?: Subscription;
  private timerSub?: Subscription;

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    // Check if we came from login with a sessionId
    const s = this.route.snapshot.queryParamMap.get('s');
    const email = this.route.snapshot.queryParamMap.get('email');
    this.targetUser.set(email);

    if (s) {
      this.sessionId.set(s);
      this.generateQrPayload(s);
      this.startPolling(s);
      this.startTimer();
    } else {
      this.initializeQrSession();
    }
  }

  ngOnDestroy() {
    this.stopSession();
  }

  private initializeQrSession() {
    this.isExpired.set(false);
    this.timeLeft.set(30);

    this.http.get<{ sessionId: string }>(`${environment.apiBaseUrl}/auth/qr/session`)
      .subscribe({
        next: (res) => {
          this.sessionId.set(res.sessionId);
          this.generateQrPayload(res.sessionId);
          this.startPolling(res.sessionId);
          this.startTimer();
        },
        error: (err) => {
          console.error('Failed to init QR session', err);
          this.isExpired.set(true);
        }
      });
  }

  private generateQrPayload(sessionId: string) {
    const mobileAuthUrl = `${environment.appBaseUrl}/qr-mobile-auth?s=${sessionId}`;
    this.qrData.set(mobileAuthUrl);
  }

  private startTimer() {
    this.timerSub?.unsubscribe();
    this.timerSub = interval(1000)
      .pipe(
        map(v => 29 - v),
        take(30)
      )
      .subscribe({
        next: (v) => {
          this.timeLeft.set(v);
          if (v === 0) {
            this.isExpired.set(true);
            this.pollingSub?.unsubscribe();
          }
        }
      });
  }

  private stopSession() {
    this.pollingSub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  protected refreshQr() {
    this.stopSession();
    this.initializeQrSession();
  }

  private startPolling(sessionId: string) {
    this.pollingSub = interval(2000)
      .pipe(
        switchMap(() => this.http.get<any>(`${environment.apiBaseUrl}/auth/qr/status/${sessionId}`)),
        takeWhile(res => res.status !== 'SUCCESS', true)
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'SUCCESS') {
            const user = {
              id: 0,
              name: res.email.split('@')[0],
              email: res.email,
              role: res.role
            };
            this.auth.saveToken(res.token, user, res.role);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => console.error('Polling error', err)
      });
  }

  protected simulateMobileAuth() {
    const s = this.sessionId();
    const email = this.targetUser() || 'admin@hospitalA.com';
    if (!s) return;

    this.http.post(`${environment.apiBaseUrl}/auth/qr/authorize`, {
      sessionId: s,
      mobileToken: 'SIMULATED_MOBILE_TOKEN',
      email: email,
      role: email.includes('admin') ? 'Admin' :
        (email.includes('doctor') ? 'Doctor' :
          (email.includes('nurse') ? 'Nurse' : 'Patient'))
    }).subscribe({
      next: () => console.log('Simulation triggered'),
      error: (err) => console.error('Simulation failed', err)
    });
  }

  cancel() {
    this.router.navigate(['/login']);
  }
}
