import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardService, StatCard, ScheduleItem, OccupancyItem } from '../../core/services/dashboard.service';
import { PatientService } from '../../core/services/patient.service';
import { BillingService } from '../../core/services/billing.service';
import { LaboratoryService, LabRequest } from '../../core/services/laboratory.service';
import { AdmissionService } from '../../core/services/admission.service';
import { Admission } from '../../core/models/admission.model';
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
  private admissionService = inject(AdmissionService);
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

  // Nurse Specific Signals
  activeAdmissions = signal<Admission[]>([]);
  nurseTasks = signal<any[]>([]);
  pendingVitalsCount = signal(5); // Mocked for UI demonstration

  // Lab Request Modal State
  showLabModal = signal(false);
  labTestType = signal('BLOOD_WORK');
  labPatientId = signal<number | null>(null);
  labNotes = signal('');

  stats = computed<StatCard[]>(() => {
    if (this.role() === 'Nurse') {
      return [
        {
          label: 'Active Admissions',
          value: this.activeAdmissions().length.toString(),
          trend: '2 new tonight',
          trendType: 'up',
          icon: 'hotel',
          isPrimary: true
        },
        {
          label: 'Pending Vitals',
          value: this.pendingVitalsCount().toString(),
          trend: 'Due now',
          trendType: 'down',
          icon: 'monitor_heart'
        },
        {
          label: 'Lab Samples',
          value: this.nurseTasks().length.toString(),
          trend: 'Awaiting collect',
          trendType: 'up',
          icon: 'biotech'
        },
        {
          label: 'Critical Alerts',
          value: '0',
          trend: 'All stable',
          trendType: 'up',
          icon: 'notifications_active'
        }
      ];
    }

    return [
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
    ];
  });

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

    if (this.role() === 'Nurse') {
      this.admissionService.getAdmissions().subscribe(a => {
        this.activeAdmissions.set(a.filter(item => item.status === 'ACTIVE'));
      });
      this.labService.getAllRequests().subscribe(reqs => {
        this.nurseTasks.set(reqs.filter(r => r.status === 'PENDING'));
      });
    }
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
