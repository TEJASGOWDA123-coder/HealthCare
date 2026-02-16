import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../core/services/appointment.service';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Surgery' | 'Diagnostic';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  appointments = signal<Appointment[]>([]);

  ngOnInit() {
    this.appointmentService.list().subscribe({
      next: (data) => this.appointments.set(data),
      error: (err) => console.error('Error fetching appointments', err)
    });
  }

  filterStatus = signal<string>('All');
  searchTerm = signal<string>('');

  filteredAppointments = computed(() => {
    let list = this.appointments();

    if (this.filterStatus() !== 'All') {
      list = list.filter(a => a.status === this.filterStatus());
    }

    const term = this.searchTerm().toLowerCase();
    if (term) {
      list = list.filter(a =>
        a.patientName.toLowerCase().includes(term) ||
        a.doctorName.toLowerCase().includes(term) ||
        a.id.toLowerCase().includes(term)
      );
    }

    return list;
  });

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-blue';
      case 'Pending': return 'status-yellow';
      case 'Completed': return 'status-green';
      case 'Cancelled': return 'status-red';
      default: return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Surgery': return '✂️';
      case 'Consultation': return '👨‍⚕️';
      case 'Diagnostic': return '🔬';
      case 'Follow-up': return '📅';
      default: return '🏥';
    }
  }
}
