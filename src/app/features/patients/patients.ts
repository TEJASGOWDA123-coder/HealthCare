import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  condition: string;
  status: 'Stable' | 'Critical' | 'Observation' | 'Recovered';
  room: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.scss',
})
export class Patients {
  // Mock Data
  private patientsList = signal<Patient[]>([
    { id: 'P-1001', name: 'Johnathan Abernathy', age: 45, gender: 'Male', lastVisit: '2024-02-08', condition: 'Hypertension', status: 'Stable', room: '302-A', phone: '+1 555-0101', email: 'j.abernathy@email.com' },
    { id: 'P-1002', name: 'Sarah Montgomery', age: 29, gender: 'Female', lastVisit: '2024-02-10', condition: 'Acute Appendicitis', status: 'Critical', room: 'ICU-04', phone: '+1 555-0202', email: 's.montgomery@email.com' },
    { id: 'P-1003', name: 'Robert Chen', age: 62, gender: 'Male', lastVisit: '2024-02-05', condition: 'Type 2 Diabetes', status: 'Observation', room: '215-B', phone: '+1 555-0303', email: 'r.chen@email.com' },
    { id: 'P-1004', name: 'Emma Thompson', age: 34, gender: 'Female', lastVisit: '2024-02-09', condition: 'Pneumonia', status: 'Stable', room: '410-C', phone: '+1 555-0404', email: 'e.thompson@email.com' },
    { id: 'P-1005', name: 'Michael Rodriguez', age: 51, gender: 'Male', lastVisit: '2024-02-10', condition: 'Post-op Recovery', status: 'Recovered', room: '105-A', phone: '+1 555-0505', email: 'm.rodri@email.com' },
    { id: 'P-1006', name: 'Alice Walker', age: 73, gender: 'Female', lastVisit: '2024-02-01', condition: 'Osteoarthritis', status: 'Stable', room: '501-A', phone: '+1 555-0606', email: 'a.walker@email.com' },
    { id: 'P-1007', name: 'David Kim', age: 19, gender: 'Male', lastVisit: '2024-02-10', condition: 'Fractured Tibia', status: 'Observation', room: 'ER-08', phone: '+1 555-0707', email: 'd.kim@email.com' },
  ]);

  searchTerm = signal('');
  selectedPatientId = signal<string | null>(null);

  // Filtered List
  filteredPatients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.patientsList();
    return this.patientsList().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.condition.toLowerCase().includes(term)
    );
  });

  // Selected Patient Detail
  selectedPatient = computed(() =>
    this.patientsList().find(p => p.id === this.selectedPatientId()) || null
  );

  selectPatient(id: string) {
    this.selectedPatientId.set(id);
  }

  closeDetails() {
    this.selectedPatientId.set(null);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Critical': return 'status-red';
      case 'Observation': return 'status-yellow';
      case 'Stable': return 'status-blue';
      case 'Recovered': return 'status-green';
      default: return '';
    }
  }
}
