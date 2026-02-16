import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    private http = inject(HttpClient);
    private api = 'http://localhost:8080/api/v1/appointments';

    list(): Observable<any[]> {
        return this.http.get<any[]>(this.api);
    }

    create(data: any): Observable<any> {
        return this.http.post(this.api, data);
    }
}
