import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './employee-form.html',
    styleUrl: './employee-form.scss'
})
export class EmployeeFormComponent {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);

    employeeForm: FormGroup;
    loading = signal(false);
    errorMessage = signal('');

    roles = ['DOCTOR', 'NURSE', 'ADMIN'];
    specializations = [
        'Cardiology', 'Neurology', 'Pediatrics', 'Oncology',
        'Orthopedics', 'Dermatology', 'General Surgery', 'Internal Medicine',
        'Clinical Support', 'Administration'
    ];

    constructor() {
        this.employeeForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            role: ['DOCTOR', Validators.required],
            specialization: ['General Medicine']
        });
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    onSubmit() {
        if (this.employeeForm.invalid) return;

        this.loading.set(true);
        this.errorMessage.set('');

        const payload = this.employeeForm.value;

        this.http.post('http://localhost:8080/api/v1/users', payload, { headers: this.getAuthHeaders() })
            .subscribe({
                next: () => {
                    this.router.navigate(['/employee']);
                },
                error: (err) => {
                    this.errorMessage.set(err.error?.message || 'Failed to create employee');
                    this.loading.set(false);
                }
            });
    }

    onCancel() {
        this.router.navigate(['/employee']);
    }
}
