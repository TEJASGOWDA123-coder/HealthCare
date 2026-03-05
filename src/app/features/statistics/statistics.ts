import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { TitleService } from '../../core/services/title.service';
import { environment } from '../../../environments/environment';

interface Stats {
    totalPatients: number;
    totalAdmissions: number;
    activeAdmissions: number;
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    staffDistribution: { [key: string]: number };
}

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './statistics.html',
    styleUrl: './statistics.scss'
})
export class StatisticsComponent implements OnInit {
    private titleService = inject(TitleService);
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    stats = signal<Stats | null>(null);
    loading = signal(true);

    private readonly API = `${environment.apiBaseUrl}/api/v1/stats/overview`;

    ngOnInit() {
        this.titleService.setTitle('Hospital Insights');
        if (isPlatformBrowser(this.platformId)) {
            this.loadStats();
        }
    }

    private getAuthHeaders(): HttpHeaders {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
            return new HttpHeaders({ Authorization: `Bearer ${token}` });
        }
        return new HttpHeaders();
    }

    loadStats() {
        this.loading.set(true);
        this.http.get<Stats>(this.API, { headers: this.getAuthHeaders() })
            .pipe(catchError(() => of(null)))
            .subscribe(data => {
                this.stats.set(data);
                this.loading.set(false);
            });
    }

    getKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
    }

    getCapacityPercent(): number {
        const currentStats = this.stats();
        if (!currentStats) return 0;
        // Assuming a fixed capacity of 100 for visual demo
        return Math.min(Math.round((currentStats.activeAdmissions / 100) * 100), 100);
    }
}
