import { Component, signal, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../core/services/appointment.service';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';

interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  department?: string;
  date?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  patient?: { id: number; firstName?: string; lastName?: string; fullName?: string; };
  doctor?: { id: number; fullName?: string; email?: string; specialization?: string; };
  type: 'Consultation' | 'Follow-up' | 'Surgery' | 'Diagnostic' | 'CONSULTATION' | 'FOLLOW_UP' | 'SURGERY' | 'DIAGNOSTIC';
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'BOOKED' | 'CANCELLED' | 'COMPLETED';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AppointmentCalendarComponent],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  viewMode = signal<'list' | 'calendar'>('calendar');
  appointments = signal<Appointment[]>([]);

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.appointmentService.list().subscribe({
        next: (data) => {
          // Use setTimeout to ensure change detection has finished its first run
          setTimeout(() => this.appointments.set(data));
        },
        error: (err) => console.error('Error fetching appointments', err)
      });
    }
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
        (a.patientName && a.patientName.toLowerCase().includes(term)) ||
        (a.doctorName && a.doctorName.toLowerCase().includes(term)) ||
        (a.id && a.id.toString().toLowerCase().includes(term))
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
