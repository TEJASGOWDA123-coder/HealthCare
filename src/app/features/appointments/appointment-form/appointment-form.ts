import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './appointment-form.html',
    styleUrl: './appointment-form.scss'
})
export class AppointmentFormComponent {
    private fb = inject(FormBuilder);
    private appointmentService = inject(AppointmentService);
    private router = inject(Router);

    form = this.fb.group({
        patientName: ['', Validators.required],
        doctorName: ['', Validators.required],
        department: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        type: ['Consultation', Validators.required],
        status: ['Confirmed', Validators.required]
    });

    submit() {
        if (this.form.valid) {
            this.appointmentService.create(this.form.value).subscribe({
                next: () => {
                    this.router.navigate(['/appointments']);
                },
                error: (err) => {
                    console.error('Error creating appointment', err);
                }
            });
        }
    }
}
