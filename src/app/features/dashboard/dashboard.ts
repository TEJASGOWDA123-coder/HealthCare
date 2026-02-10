import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';
import { AuthService } from '../../core/auth/auth.service';

interface StatCard {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: string;
  isPrimary?: boolean;
}

interface ScheduleItem {
  time: string;
  title: string;
  duration: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private titleService = inject(TitleService);
  authService = inject(AuthService);

  stats = signal<StatCard[]>([
    { label: 'Appointments', value: '1,250', trend: '4.8% from last week', trendType: 'up', icon: 'event_available', isPrimary: true },
    { label: 'Surgeries', value: '60', trend: '25% from last week', trendType: 'down', icon: 'medical_services' },
    { label: 'Total patient', value: '1,835', trend: '2.1% from last week', trendType: 'up', icon: 'group' },
  ]);

  schedule = signal<ScheduleItem[]>([
    { time: '09:00 AM', title: 'Dentist meetup', duration: '10:00 AM - 11:00 AM', color: '#0d9488' },
    { time: '12:00 PM', title: 'Procedures', duration: '12:00 PM - 04:00 PM', color: '#0ea5e9' },
  ]);

  occupancy = signal([
    { label: 'General room', count: 124, color: '#0d9488' },
    { label: 'Private room', count: 52, color: '#0ea5e9' },
  ]);

  ngOnInit() {
    this.titleService.setTitle(''); // We'll show the greeting in the component instead of the header title for this specific design
  }
}
