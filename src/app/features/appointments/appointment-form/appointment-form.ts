import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';

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

    isEditMode = false;
    appointmentId: string | null = null;

    form = this.fb.group({
        patientName: ['', Validators.required],
        doctorName: ['', Validators.required],
        department: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        type: ['Consultation', Validators.required],
        status: ['Confirmed', Validators.required]
    });

    ngOnInit() {
        this.appointmentId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.appointmentId;

        if (this.isEditMode) {
            this.appointmentService.getById(this.appointmentId!).subscribe({
                next: (data) => {
                    this.form.patchValue(data);
                },
                error: (err) => console.error('Error fetching appointment', err)
            });
        }
    }

    submit() {
        if (this.form.valid) {
            const request$ = this.isEditMode
                ? this.appointmentService.update(this.appointmentId!, this.form.value)
                : this.appointmentService.create(this.form.value);

            request$.subscribe({
                next: () => {
                    this.router.navigate(['/appointments']);
                },
                error: (err) => {
                    console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} appointment`, err);
                }
            });
        }
    }
}
