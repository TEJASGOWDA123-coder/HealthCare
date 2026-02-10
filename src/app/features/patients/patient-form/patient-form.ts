import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Gender, PatientStatus } from '../../../core/models/patient.model';
import { TitleService } from '../../../core/services/title.service';

@Component({
    selector: 'app-patient-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './patient-form.html',
    styleUrl: './patient-form.scss'
})
export class PatientFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private patientService = inject(PatientService);
    private titleService = inject(TitleService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    patientForm!: FormGroup;
    isEditMode = signal(false);
    patientId = signal<string | null>(null);
    submitting = signal(false);

    genders: Gender[] = ['Male', 'Female', 'Other'];
    statuses: PatientStatus[] = ['Stable', 'Critical', 'Observation', 'Recovered'];

    ngOnInit() {
        this.initForm();
        this.checkEditMode();
        this.titleService.setTitle(this.isEditMode() ? 'Edit Patient' : 'Add Patient');
    }

    private initForm() {
        this.patientForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            age: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
            gender: ['', Validators.required],
            condition: ['', Validators.required],
            status: ['Stable', Validators.required],
            room: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
            email: ['', [Validators.required, Validators.email]],
            lastVisit: [new Date().toISOString().split('T')[0], Validators.required],
            address: [''],
            bloodGroup: ['']
        });
    }

    private checkEditMode() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.patientId.set(id);
            this.loadPatient(id);
        }
    }

    private loadPatient(id: string) {
        this.patientService.getPatient(id).subscribe({
            next: (patient) => {
                this.patientForm.patchValue(patient);
            },
            error: (err) => {
                console.error('Error loading patient', err);
                this.router.navigate(['/patients']);
            }
        });
    }

    onSubmit() {
        if (this.patientForm.invalid) {
            this.patientForm.markAllAsTouched();
            return;
        }

        this.submitting.set(true);
        const patientData = this.patientForm.value;

        if (this.isEditMode()) {
            this.patientService.updatePatient(this.patientId()!, patientData).subscribe({
                next: () => this.onSuccess(),
                error: (err) => this.onError(err)
            });
        } else {
            this.patientService.createPatient(patientData).subscribe({
                next: () => this.onSuccess(),
                error: (err) => this.onError(err)
            });
        }
    }

    private onSuccess() {
        this.submitting.set(false);
        this.router.navigate(['/patients']);
    }

    private onError(err: any) {
        this.submitting.set(false);
        console.error('Error saving patient', err);
    }
}
