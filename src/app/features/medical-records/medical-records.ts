import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.scss',
})
export class MedicalRecords implements OnInit {
  private http = inject(HttpClient);

  patients = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  selected = signal<any | null>(null);

  filtered = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return this.patients().filter(p =>
      (`${p.firstName} ${p.lastName}`).toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phoneNumber || '').toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/patients`)
      .subscribe({
        next: (data) => { this.patients.set(data); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  select(p: any) {
    this.selected.set(p);
  }

  close() {
    this.selected.set(null);
  }

  exportPdf(id: number) {
    window.open(`${environment.apiBaseUrl}/api/v1/patients/${id}/export-pdf`, '_blank');
  }
}
