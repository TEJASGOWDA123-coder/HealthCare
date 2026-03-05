import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, CreatePatientDto, UpdatePatientDto } from '../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/patients`;
    private http = inject(HttpClient);

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl);
    }

    getPatient(id: string): Observable<Patient> {
        return this.http.get<Patient>(`${this.apiUrl}/${id}`);
    }

    createPatient(patient: CreatePatientDto): Observable<Patient> {
        return this.http.post<Patient>(this.apiUrl, patient);
    }

    updatePatient(id: string, patient: UpdatePatientDto): Observable<Patient> {
        return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
    }

    deletePatient(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
