import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService, StatCard, ScheduleItem, OccupancyItem } from '../../core/services/dashboard.service';
import { PatientService } from '../../core/services/patient.service';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private titleService = inject(TitleService);
  private dashboardService = inject(DashboardService);
  private patientService = inject(PatientService);
  private billingService = inject(BillingService);
  authService = inject(AuthService);
  today = new Date();

  // Dynamic signals
  schedule = signal<ScheduleItem[]>([]);
  occupancy = signal<OccupancyItem[]>([]);
  rawStats = signal({ appointments: 0, appointmentsTrend: 0, surgeries: 0, surgeriesTrend: 0 });

  // Real patient count from service
  patientsCount = signal(0);
  invoices = signal<any[]>([]);

  stats = computed<StatCard[]>(() => [
    {
      label: 'Appointments',
      value: this.rawStats().appointments.toLocaleString(),
      trend: `${this.rawStats().appointmentsTrend}% from last week`,
      trendType: this.rawStats().appointmentsTrend >= 0 ? 'up' : 'down',
      icon: 'event_available',
      isPrimary: true
    },
    {
      label: 'Surgeries',
      value: this.rawStats().surgeries.toLocaleString(),
      trend: `${Math.abs(this.rawStats().surgeriesTrend)}% from last week`,
      trendType: this.rawStats().surgeriesTrend >= 0 ? 'up' : 'down',
      icon: 'medical_services'
    },
    {
      label: 'Total patient',
      value: this.patientsCount().toLocaleString(),
      trend: '2.1% from last week',
      trendType: 'up',
      icon: 'group'
    },
  ]);

  balanceStats = computed(() => {
    const all = this.invoices();
    const income = all.filter(i => i.status.toLowerCase() === 'paid').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = 0; // Removing mock expense
    const totalRevenue = income - expense;
    return {
      income,
      expense,
      totalRevenue,
      percent: Math.min(Math.round((income / (income + expense)) * 100), 100)
    };
  });

  ngOnInit() {
    this.titleService.setTitle('');
    this.loadData();
  }

  private loadData() {
    this.dashboardService.getStats().subscribe(s => this.rawStats.set(s));
    this.dashboardService.getSchedule().subscribe(s => this.schedule.set(s));
    this.dashboardService.getOccupancy().subscribe(o => this.occupancy.set(o));

    // Fetch live data from existing services
    this.patientService.getPatients().subscribe(p => this.patientsCount.set(p.length));
    this.billingService.getInvoices().subscribe(i => this.invoices.set(i));
  }
}
