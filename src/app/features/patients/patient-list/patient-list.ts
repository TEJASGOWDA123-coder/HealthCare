import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { AuthService } from '../../../core/auth/auth.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
    selector: 'app-patient-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './patient-list.html',
    styleUrl: './patient-list.scss'
})
export class PatientListComponent implements OnInit {
    private patientService = inject(PatientService);
    private titleService = inject(TitleService);
    authService = inject(AuthService);

    patients = signal<Patient[]>([]);
    searchTerm = signal('');
    loading = signal(true);

    filteredPatients = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.patients().map(p => ({
            ...p,
            name: `${p.firstName} ${p.lastName}`
        })).filter(p =>
            p.firstName.toLowerCase().includes(term) ||
            p.lastName.toLowerCase().includes(term) ||
            p.id.toString().toLowerCase().includes(term) ||
            p.condition.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.titleService.setTitle('Patients');
        this.loadPatients();
    }

    loadPatients() {
        this.loading.set(true);
        this.patientService.getPatients().subscribe({
            next: (data) => {
                this.patients.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading patients', err);
                this.loading.set(false);
                // In a real app, show a toast here
            }
        });
    }

    deletePatient(id: string) {
        if (confirm('Are you sure you want to delete this patient?')) {
            this.patientService.deletePatient(id).subscribe(() => {
                this.patients.update(prev => prev.filter(p => p.id !== id));
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Critical': return 'status-red';
            case 'Observation': return 'status-yellow';
            case 'Stable': return 'status-blue';
            case 'Recovered': return 'status-green';
            default: return 'status-gray';
        }
    }
}
