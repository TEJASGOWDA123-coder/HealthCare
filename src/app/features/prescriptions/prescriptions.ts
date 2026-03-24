import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Prescriptions feature component
@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.scss',
})
export class Prescriptions implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);

  patients = signal<any[]>([]);
  doctors = signal<any[]>([]);
  prescriptions = signal<any[]>([]);
  loading = signal(true);
  showForm = signal(false);
  submitError = signal('');
  searchTerm = signal('');

  filtered = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.prescriptions().filter(p =>
      (p.patientName || '').toLowerCase().includes(q) ||
      (p.doctorName || '').toLowerCase().includes(q) ||
      (p.medication || '').toLowerCase().includes(q)
    );
  });

  form = this.fb.group({
    patientName: ['', Validators.required],
    doctorName: ['', Validators.required],
    medication: ['', Validators.required],
    dosage: ['', Validators.required],
    frequency: ['Once daily', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    notes: ['']
  });

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/patients`).subscribe({
      next: d => { this.patients.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/users/doctors`).subscribe({
      next: d => this.doctors.set(d)
    });
    // Load prescriptions - use local storage as fallback if no API yet
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('prescriptions');
      if (saved) this.prescriptions.set(JSON.parse(saved));
    }
  }

  savePrescription() {
    if (this.form.invalid) return;
    const val = this.form.value as any;
    val.id = Date.now();
    val.createdAt = new Date().toISOString();
    val.status = 'Active';
    const updated = [...this.prescriptions(), val];
    this.prescriptions.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('prescriptions', JSON.stringify(updated));
    }
    this.form.reset({ frequency: 'Once daily' });
    this.showForm.set(false);
  }

  deletePrescription(id: number) {
    const updated = this.prescriptions().filter(p => p.id !== id);
    this.prescriptions.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('prescriptions', JSON.stringify(updated));
    }
  }

  statusClass(status: string) {
    return status === 'Active' ? 'status-green' : 'status-red';
  }
}
