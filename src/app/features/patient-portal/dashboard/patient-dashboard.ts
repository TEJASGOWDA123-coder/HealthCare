import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { TitleService } from '../../../core/services/title.service';
import { Admission } from '../../../core/models/admission.model';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-patient-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './patient-dashboard.html',
    styleUrl: './patient-dashboard.scss'
})
export class PatientDashboard implements OnInit {
    private titleService = inject(TitleService);
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    patientProfile = signal<any>(null);
    activeAdmission = signal<Admission | null>(null);
    loading = signal(true);

    private readonly API = `${environment.apiBaseUrl}/api/v1`;

    ngOnInit() {
        this.titleService.setTitle('My Health Portal');
        this.loadPatientData();
    }

    private getAuthHeaders(): HttpHeaders {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
            return new HttpHeaders({ Authorization: `Bearer ${token}` });
        }
        return new HttpHeaders();
    }

    loadPatientData() {
        this.loading.set(true);
        const headers = this.getAuthHeaders();

        // Load Profile
        this.http.get<any>(`${this.API}/patients/me`, { headers })
            .pipe(catchError(() => of(null)))
            .subscribe(profile => {
                this.patientProfile.set(profile);
            });

        // Load Admissions
        this.http.get<Admission[]>(`${this.API}/admissions/me`, { headers })
            .pipe(catchError(() => of([])))
            .subscribe(admissions => {
                // Find most recent active/pending admission
                const active = admissions.find(a => a.status === 'ACTIVE' || a.status === 'PENDING');
                this.activeAdmission.set(active || (admissions.length > 0 ? admissions[0] : null));
                this.loading.set(false);
            });
    }

    getBmiStatus(bmi: number): string {
        if (!bmi) return 'N/A';
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal Weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }
}
