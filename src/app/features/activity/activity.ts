import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { TitleService } from '../../core/services/title.service';

interface Activity {
    id: number;
    type: string;
    title: string;
    description: string;
    performedBy: string;
    timestamp: string;
    status: string;
}

@Component({
    selector: 'app-activity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activity.html',
    styleUrl: './activity.scss'
})
export class ActivityComponent implements OnInit {
    private titleService = inject(TitleService);
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    activities = signal<Activity[]>([]);
    loading = signal(true);

    private readonly API = 'http://localhost:8080/api/v1/activities';

    ngOnInit() {
        this.titleService.setTitle('System Activity');
        if (isPlatformBrowser(this.platformId)) {
            this.loadActivities();
        }
    }

    private getAuthHeaders(): HttpHeaders {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
            return new HttpHeaders({ Authorization: `Bearer ${token}` });
        }
        return new HttpHeaders();
    }

    loadActivities() {
        this.loading.set(true);
        this.http.get<Activity[]>(this.API, { headers: this.getAuthHeaders() })
            .pipe(catchError(() => of([])))
            .subscribe(data => {
                this.activities.set(data);
                this.loading.set(false);
            });
    }

    getIcon(type: string): string {
        switch (type) {
            case 'ADMISSION': return 'medical_services';
            case 'APPOINTMENT': return 'event';
            case 'BILLING': return 'payments';
            case 'SYSTEM': return 'settings';
            default: return 'info';
        }
    }

    formatDate(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
