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
    // ADMIN MENU
    { label: 'Dashboard', route: '/dashboard', roles: ['Admin', 'Doctor', 'Nurse', 'Patient'], icon: 'grid_view' },
    { label: 'Appointments', route: '/appointments', roles: ['Admin', 'Doctor', 'Nurse'], icon: 'calendar_today' },
    { label: 'Patient Admission', route: '/admissions', roles: ['Admin', 'Nurse'], icon: 'local_hospital' },
    { label: 'User Management', route: '/employee', roles: ['Admin'], icon: 'person_outline' },
    { label: 'Billing', route: '/billing', roles: ['Admin'], icon: 'payments' },
    { label: 'Audit Logs', route: '/activity', roles: ['Admin'], icon: 'history' },

    // DOCTOR MENU
    { label: 'Patient Records', route: '/medical-records', roles: ['Doctor', 'Admin'], icon: 'folder_shared' },
    { label: 'Prescriptions', route: '/prescriptions', roles: ['Doctor', 'Admin'], icon: 'vaccines' },

    // NURSE MENU
    { label: 'Patient Monitoring', route: '/patients', roles: ['Nurse', 'Admin'], icon: 'monitor_heart' },
    { label: 'Vitals Update', route: '/admissions', roles: ['Nurse', 'Admin'], icon: 'favorite_border' }
  ];

  otherMenu: MenuItem[] = [
    { label: 'Setting', route: '/settings', roles: ['Admin', 'Doctor', 'Nurse', 'Patient'], icon: 'settings' }
  ];

  hasRole(roles: Role[]): boolean {
    return this.authService.hasRole(roles);
  }
}
