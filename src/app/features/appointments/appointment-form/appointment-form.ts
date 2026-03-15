import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './appointment-form.html',
    styleUrl: './appointment-form.scss'
})
export class AppointmentFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private appointmentService = inject(AppointmentService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);

    isEditMode = false;
    appointmentId: string | null = null;
    isSubmitting = false;
    submitError = '';

    doctors = signal<any[]>([]);
    patients = signal<any[]>([]);
    slots = signal<any[]>([]);
    selectedSlot = signal<any | null>(null);

    form = this.fb.group({
        patientId: ['', Validators.required],
        doctorId: ['', Validators.required],
        date: ['', Validators.required],
        type: ['CONSULTATION', Validators.required],
        status: ['BOOKED', Validators.required]
    });

    ngOnInit() {
        this.appointmentId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.appointmentId;
        this.loadDoctors();
        this.loadPatients();

        // Load slots when doctor or date changes
        this.form.get('doctorId')?.valueChanges.subscribe(() => this.loadSlots());
        this.form.get('date')?.valueChanges.subscribe(() => this.loadSlots());
    }

    private loadDoctors() {
        this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/users/doctors`)
            .subscribe({
                next: (data) => this.doctors.set(data),
                error: (err) => console.error('Failed to load doctors', err)
            });
    }

    private loadPatients() {
        this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/patients`)
            .subscribe({
                next: (data) => this.patients.set(data),
                error: (err) => console.error('Failed to load patients', err)
            });
    }

    private loadSlots() {
        const doctorId = this.form.get('doctorId')?.value;
        const date = this.form.get('date')?.value;

        if (doctorId && date) {
            this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/appointments/slots`, {
                params: { doctorId, date }
            }).subscribe({
                next: (data) => {
                    this.slots.set(data);
                    this.selectedSlot.set(null); // Reset selection
                },
                error: (err) => console.error('Failed to load slots', err)
            });
        }
    }

    selectSlot(slot: any) {
        if (slot.status === 'AVAILABLE') {
            this.selectedSlot.set(slot);
        }
    }

    submit() {
        if (this.form.invalid || !this.selectedSlot()) return;

        this.isSubmitting = true;
        this.submitError = '';

        const val = this.form.value;
        const date = val.date!;
        const slot = this.selectedSlot();
        const startTime = `${date}T${slot.time}:00`;
        const endTime = `${date}T${slot.endTime}:00`;

        const payload: any = {
            patient: { id: Number(val.patientId) },
            doctor: { id: Number(val.doctorId) },
            startTime,
            endTime,
            type: val.type,
            status: val.status
        };

        const request$ = this.isEditMode
            ? this.appointmentService.update(this.appointmentId!, payload)
            : this.appointmentService.create(payload);

        request$.subscribe({
            next: () => this.router.navigate(['/appointments']),
            error: (err) => {
                console.error('Error saving appointment', err);
                this.submitError = err?.error?.message || 'Failed to schedule appointment. Please try again.';
                this.isSubmitting = false;
            }
        });
    }
}
