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

    form = this.fb.group({
        patientId: ['', Validators.required],
        doctorId: ['', Validators.required],
        date: ['', Validators.required],
        startHour: ['09:00', Validators.required],
        endHour: ['10:00', Validators.required],
        type: ['CONSULTATION', Validators.required],
        status: ['BOOKED', Validators.required]
    });

    ngOnInit() {
        this.appointmentId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.appointmentId;
        this.loadDoctors();
        this.loadPatients();
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

    submit() {
        if (this.form.invalid) return;

        this.isSubmitting = true;
        this.submitError = '';

        const val = this.form.value;
        const date = val.date!;
        const startTime = `${date}T${val.startHour}:00`;
        const endTime = `${date}T${val.endHour}:00`;

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
