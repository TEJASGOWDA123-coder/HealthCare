import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../../core/auth/auth.service';
import { interval, Subscription, switchMap, takeWhile, timer, map, take } from 'rxjs';

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
  private router = inject(Router);
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  protected readonly qrData = signal<string | null>(null);
  protected readonly timeLeft = signal<number>(30);
  protected readonly isExpired = signal<boolean>(false);
  private pollingSub?: Subscription;
  private timerSub?: Subscription;

  ngOnInit() {
    this.initializeQrSession();
  }

  ngOnDestroy() {
    this.stopSession();
  }

  private initializeQrSession() {
    this.isExpired.set(false);
    this.timeLeft.set(30);

    this.http.get<{ sessionId: string }>('http://10.48.231.236:8080/auth/qr/session')
      .subscribe({
        next: (res) => {
          const mobileAuthUrl = `http://10.48.231.236:4200/qr-mobile-auth?s=${res.sessionId}`;
          this.qrData.set(mobileAuthUrl);
          this.startPolling(res.sessionId);
          this.startTimer();
        },
        error: (err) => {
          console.error('Failed to init QR session', err);
          this.isExpired.set(true);
        }
      });
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
        switchMap(() => this.http.get<any>(`http://10.48.231.236:8080/auth/qr/status/${sessionId}`)),
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

  cancel() {
    this.router.navigate(['/login']);
  }
}
