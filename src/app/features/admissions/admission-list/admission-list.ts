import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../../../core/services/admission.service';
import { Admission } from '../../../core/models/admission.model';
import { AuthService } from '../../../core/auth/auth.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
    selector: 'app-admission-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './admission-list.html',
    styleUrl: './admission-list.scss'
})
export class AdmissionListComponent implements OnInit {
    private admissionService = inject(AdmissionService);
    private titleService = inject(TitleService);
    authService = inject(AuthService);

    admissions = signal<Admission[]>([]);
    searchTerm = signal('');
    loading = signal(true);

    filteredAdmissions = computed(() => {
        const term = this.searchTerm().toLowerCase();
        return this.admissions().filter(a =>
            a.patientName.toLowerCase().includes(term) ||
            a.roomNumber.toLowerCase().includes(term) ||
            a.doctorInCharge.toLowerCase().includes(term) ||
            a.status.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.titleService.setTitle('Admissions');
        this.loadAdmissions();
    }

    loadAdmissions() {
        this.loading.set(true);

        // If doctor, load only their admissions. If admin/nurse, load all.
        const request = this.authService.hasRole(['Doctor'])
            ? this.admissionService.getMyAdmissions()
            : this.admissionService.getAdmissions();

        request.subscribe({
            next: (data) => {
                this.admissions.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading admissions', err);
                this.loading.set(false);
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'PENDING': return 'status-yellow';
            case 'ACTIVE': return 'status-green';
            case 'DISCHARGED': return 'status-blue';
            default: return 'status-gray';
        }
    }
}
