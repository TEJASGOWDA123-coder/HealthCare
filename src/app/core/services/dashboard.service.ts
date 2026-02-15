import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatCard {
    label: string;
    value: string;
    trend: string;
    trendType: 'up' | 'down';
    icon: string;
    isPrimary?: boolean;
}

export interface DashboardStats {
    appointments: number;
    appointmentsTrend: number;
    surgeries: number;
    surgeriesTrend: number;
    totalPatients: number;
    patientsTrend: number;
}

export interface ScheduleItem {
    time: string;
    title: string;
    duration: string;
    color: string;
}

export interface OccupancyItem {
    label: string;
    count: number;
    color: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/v1/dashboard';

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
    }

    getSchedule(): Observable<ScheduleItem[]> {
        return this.http.get<ScheduleItem[]>(`${this.apiUrl}/schedule`);
    }

    getOccupancy(): Observable<OccupancyItem[]> {
        return this.http.get<OccupancyItem[]>(`${this.apiUrl}/occupancy`);
    }
}
