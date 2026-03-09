import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService } from '../../../core/services/appointment.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-appointment-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, MatDialogModule],
    template: `
    <div class="calendar-container card p-4">
      <div class="header d-flex justify-content-between align-items-center mb-4">
        <h2>Doctor Schedule</h2>
        <div class="doctor-filter">
          <!-- TODO: Add doctor selection dropdown -->
        </div>
      </div>
      <full-calendar [options]="calendarOptions()"></full-calendar>
    </div>
  `,
    styles: [`
    .calendar-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    ::ng-deep .fc {
      --fc-border-color: #f0f0f0;
      --fc-today-bg-color: #f8faff;
      font-family: 'Inter', sans-serif;
    }
    ::ng-deep .fc-header-toolbar {
      margin-bottom: 2em !important;
    }
    ::ng-deep .fc-button-primary {
      background-color: #4361ee !important;
      border-color: #4361ee !important;
    }
  `]
})
export class AppointmentCalendarComponent implements OnInit {
    private appointmentService = inject(AppointmentService);
    private dialog = inject(MatDialog);

    calendarOptions = signal<CalendarOptions>({
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        editable: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        events: []
    });

    ngOnInit() {
        this.loadAppointments();
    }

    loadAppointments() {
        this.appointmentService.list().subscribe(appointments => {
            const events: EventInput[] = appointments.map(a => ({
                id: a.id.toString(),
                title: `Appointment with ${a.patient?.firstName || 'Patient'}`,
                start: a.startTime,
                end: a.endTime,
                backgroundColor: this.getStatusColor(a.status),
                borderColor: this.getStatusColor(a.status),
                extendedProps: { ...a }
            }));

            this.calendarOptions.update(options => ({ ...options, events }));
        });
    }

    handleDateSelect(selectInfo: any) {
        // Open booking dialog
        console.log('Date Selected:', selectInfo);
        // TODO: Implement Booking Dialog
    }

    handleEventClick(clickInfo: any) {
        if (confirm(`Are you sure you want to cancel the appointment '${clickInfo.event.title}'?`)) {
            this.appointmentService.cancel(clickInfo.event.id).subscribe(() => {
                clickInfo.event.remove();
            });
        }
    }

    private getStatusColor(status: string): string {
        switch (status) {
            case 'BOOKED': return '#4361ee';
            case 'CANCELLED': return '#e63946';
            case 'COMPLETED': return '#2a9d8f';
            default: return '#f4a261';
        }
    }
}
