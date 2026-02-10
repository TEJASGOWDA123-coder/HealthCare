import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { TitleService } from '../../core/services/title.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  titleService = inject(TitleService);
  private router = inject(Router);

  addPatient() {
    this.router.navigate(['/patients/new']);
  }

  logout() {
    this.authService.logout();
  }
}
