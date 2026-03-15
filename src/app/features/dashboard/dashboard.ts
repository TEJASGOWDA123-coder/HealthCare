import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService, StatCard, ScheduleItem, OccupancyItem } from '../../core/services/dashboard.service';
import { PatientService } from '../../core/services/patient.service';
import { BillingService } from '../../core/services/billing.service';
import { LaboratoryService } from '../../core/services/laboratory.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private titleService = inject(TitleService);
  private dashboardService = inject(DashboardService);
  private patientService = inject(PatientService);
  private billingService = inject(BillingService);
  private labService = inject(LaboratoryService);
  authService = inject(AuthService);
  role = computed(() => this.authService.currentUser()?.role || 'Admin');
  today = new Date();

  // Dynamic signals
  schedule = signal<ScheduleItem[]>([]);
  occupancy = signal<OccupancyItem[]>([]);
  rawStats = signal({ appointments: 0, appointmentsTrend: 0, surgeries: 0, surgeriesTrend: 0 });

  // Real patient count from service
  patientsCount = signal(0);
  invoices = signal<any[]>([]);
  patients = signal<any[]>([]);

  // Lab Request Modal State
  showLabModal = signal(false);
  labTestType = signal('BLOOD_WORK');
  labPatientId = signal<number | null>(null);
  labNotes = signal('');

  stats = computed<StatCard[]>(() => [
    {
      label: 'New Admissions',
      value: this.rawStats().appointments.toLocaleString(),
      trend: `${this.rawStats().appointmentsTrend}% from last week`,
      trendType: this.rawStats().appointmentsTrend >= 0 ? 'up' : 'down',
      icon: 'person_add',
      isPrimary: true
    },
    {
      label: 'Avg. Consultation',
      value: '24 min',
      trend: '1.2% faster',
      trendType: 'up',
      icon: 'timer'
    },
    {
      label: 'Active Surgeries',
      value: this.rawStats().surgeries.toLocaleString(),
      trend: `${Math.abs(this.rawStats().surgeriesTrend)}% from last week`,
      trendType: this.rawStats().surgeriesTrend >= 0 ? 'up' : 'down',
      icon: 'emergency'
    },
    {
      label: 'Patient Satisfaction',
      value: '98%',
      trend: '4.5% improvement',
      trendType: 'up',
      icon: 'favorite'
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

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.titleService.setTitle('');
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  private loadData() {
    this.dashboardService.getStats().subscribe(s => this.rawStats.set(s));
    this.dashboardService.getSchedule().subscribe(s => this.schedule.set(s));
    this.dashboardService.getOccupancy().subscribe(o => this.occupancy.set(o));

    // Fetch live data from existing services
    this.patientService.getPatients().subscribe(p => {
      this.patientsCount.set(p.length);
      this.patients.set(p);
    });
    this.billingService.getInvoices().subscribe(i => this.invoices.set(i));
  }

  submitLabRequest() {
    if (!this.labPatientId()) return;

    this.labService.createRequest({
      patient: { id: this.labPatientId() },
      doctor: { id: this.authService.currentUser()?.id },
      testType: this.labTestType(),
      notes: this.labNotes()
    }).subscribe(() => {
      this.showLabModal.set(false);
      this.resetLabForm();
    });
  }

  resetLabForm() {
    this.labTestType.set('BLOOD_WORK');
    this.labPatientId.set(null);
    this.labNotes.set('');
  }
}
