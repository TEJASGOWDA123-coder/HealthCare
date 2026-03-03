import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/auth.models';

interface MenuItem {
  label: string;
  route: string;
  roles: Role[];
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  authService = inject(AuthService);

  mainMenu: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', roles: ['Admin', 'Doctor', 'Nurse', 'Patient'], icon: 'grid_view' },
    { label: 'Patients', route: '/patients', roles: ['Admin', 'Doctor', 'Nurse'], icon: 'people' },
    { label: 'Admissions', route: '/admissions', roles: ['Admin', 'Doctor', 'Nurse'], icon: 'local_hospital' },
    { label: 'Appointment', route: '/appointments', roles: ['Admin', 'Doctor', 'Nurse'], icon: 'event_available' },
    { label: 'Payments', route: '/billing', roles: ['Admin'], icon: 'payments' },
    { label: 'Employee', route: '/employee', roles: ['Admin'], icon: 'person_outline' },
    { label: 'Activity', route: '/activity', roles: ['Admin', 'Doctor'], icon: 'insights' },
  ];

  otherMenu: MenuItem[] = [
    { label: 'Statistic', route: '/statistics', roles: ['Admin'], icon: 'bar_chart' },
    { label: 'Help & Center', route: '/help', roles: ['Admin', 'Doctor', 'Nurse', 'Patient'], icon: 'help_outline' },
    { label: 'Setting', route: '/settings', roles: ['Admin', 'Doctor', 'Nurse', 'Patient'], icon: 'settings' },
    { label: 'Report', route: '/reports', roles: ['Admin'], icon: 'description' },
  ];

  hasRole(roles: Role[]): boolean {
    return this.authService.hasRole(roles);
  }
}
