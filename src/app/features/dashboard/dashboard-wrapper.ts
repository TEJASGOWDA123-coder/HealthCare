import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Dashboard } from './dashboard';
import { PatientDashboard } from '../patient-portal/dashboard/patient-dashboard';

@Component({
    selector: 'app-dashboard-wrapper',
    standalone: true,
    imports: [CommonModule, Dashboard, PatientDashboard],
    template: `
    <ng-container [ngSwitch]="role">
      <app-dashboard *ngSwitchCase="'Admin'"></app-dashboard>
      <app-dashboard *ngSwitchCase="'Doctor'"></app-dashboard>
      <app-dashboard *ngSwitchCase="'Nurse'"></app-dashboard>
      <app-patient-dashboard *ngSwitchCase="'Patient'"></app-patient-dashboard>
      <div *ngSwitchDefault class="p-4">
        <p>Loading your dashboard...</p>
      </div>
    </ng-container>
  `
})
export class DashboardWrapper {
    private auth = inject(AuthService);

    get role() {
        return this.auth.currentUser()?.role;
    }
}
