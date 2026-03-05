import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    private http = inject(HttpClient);
    private api = `${environment.apiBaseUrl}/api/v1/appointments`;

    list(): Observable<any[]> {
        return this.http.get<any[]>(this.api);
    }

    create(data: any): Observable<any> {
        return this.http.post(this.api, data);
    }

    getById(id: number | string): Observable<any> {
        return this.http.get<any>(`${this.api}/${id}`);
    }

    update(id: number | string, data: any): Observable<any> {
        return this.http.put(`${this.api}/${id}`, data);
    }
}
