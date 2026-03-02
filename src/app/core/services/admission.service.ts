import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admission, CreateAdmissionDto } from '../models/admission.model';

@Injectable({
    providedIn: 'root'
})
export class AdmissionService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/admissions';
    private http = inject(HttpClient);

    getAdmissions(): Observable<Admission[]> {
        return this.http.get<Admission[]>(this.apiUrl);
    }

    getAdmission(id: number): Observable<Admission> {
        return this.http.get<Admission>(`${this.apiUrl}/${id}`);
    }

    createAdmission(admission: CreateAdmissionDto): Observable<Admission> {
        return this.http.post<Admission>(this.apiUrl, admission);
    }

    updateAdmission(id: number, admission: Partial<Admission>): Observable<Admission> {
        return this.http.put<Admission>(`${this.apiUrl}/${id}`, admission);
    }

    deleteAdmission(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
