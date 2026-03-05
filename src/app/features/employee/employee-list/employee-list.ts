import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TitleService } from '../../../core/services/title.service';
import { environment } from '../../../../environments/environment';

interface Staff {
    id: number;
    email: string;
    fullName: string;
    role: string;
    specialization?: string;
}

@Component({
    selector: 'app-employee-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './employee-list.html',
    styleUrl: './employee-list.scss'
})
export class EmployeeListComponent implements OnInit {
    private titleService = inject(TitleService);
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private router = inject(Router);

    staffList = signal<Staff[]>([]);
    loading = signal(true);

    // Computed stats to avoid logic in template and fix TS errors
    totalStaff = computed(() => this.staffList().length);
    doctorCount = computed(() => this.staffList().filter(s => s.role === 'DOCTOR').length);
    nurseCount = computed(() => this.staffList().filter(s => s.role === 'NURSE').length);

    private readonly API = `${environment.apiBaseUrl}/api/v1/users`;

    navigateToForm() {
        this.router.navigate(['/employee/new']);
    }

    ngOnInit() {
        this.titleService.setTitle('System Employees');
        if (isPlatformBrowser(this.platformId)) {
            this.loadStaff();
        }
    }

    private getAuthHeaders(): HttpHeaders {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
            return new HttpHeaders({ Authorization: `Bearer ${token}` });
        }
        return new HttpHeaders();
    }

    loadStaff() {
        this.loading.set(true);
        this.http.get<Staff[]>(this.API, { headers: this.getAuthHeaders() })
            .pipe(catchError(() => of([])))
            .subscribe(data => {
                this.staffList.set(data);
                this.loading.set(false);
            });
    }

    getRoleClass(role: string): string {
        return role ? role.toLowerCase() : 'staff';
    }

    getInitials(name: string): string {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
    }
}
