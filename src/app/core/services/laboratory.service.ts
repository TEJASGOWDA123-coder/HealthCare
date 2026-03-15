import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LabRequest {
    id?: number;
    patient: any;
    doctor: any;
    testType: string;
    status: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LabResult {
    id?: number;
    request?: LabRequest;
    resultText: string;
    fileUrl?: string;
    createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class LaboratoryService {
    private http = inject(HttpClient);
    private api = `${environment.apiBaseUrl}/api/v1/laboratory`;

    getAllRequests(): Observable<LabRequest[]> {
        return this.http.get<LabRequest[]>(`${this.api}/requests`);
    }

    createRequest(request: Partial<LabRequest>): Observable<LabRequest> {
        return this.http.post<LabRequest>(`${this.api}/requests`, request);
    }

    getRequestsByPatient(patientId: number): Observable<LabRequest[]> {
        return this.http.get<LabRequest[]>(`${this.api}/requests/patient/${patientId}`);
    }

    getRequestById(id: number): Observable<LabRequest> {
        return this.http.get<LabRequest>(`${this.api}/requests/${id}`);
    }

    uploadResult(requestId: number, result: Partial<LabResult>): Observable<LabResult> {
        return this.http.post<LabResult>(`${this.api}/requests/${requestId}/results`, result);
    }

    getResult(requestId: number): Observable<LabResult> {
        return this.http.get<LabResult>(`${this.api}/requests/${requestId}/results`);
    }
}
