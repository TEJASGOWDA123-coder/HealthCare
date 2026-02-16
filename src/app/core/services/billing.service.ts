import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private api = 'http://localhost:8080/api/v1/invoices';

    constructor(private http: HttpClient) { }

    getInvoices(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(this.api);
    }

    getInvoice(id: string): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.api}/${id}`);
    }

    createInvoice(data: any): Observable<Invoice> {
        return this.http.post<Invoice>(this.api, data);
    }

    deleteInvoice(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/${id}`);
    }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.api}/stats`);
    }

    downloadPdf(id: string): Observable<Blob> {
        return this.http.get(`${this.api}/${id}/pdf`, { responseType: 'blob' });
    }

    getQr(id: string): Observable<Blob> {
        return this.http.get(`${this.api}/${id}/qr`, { responseType: 'blob' });
    }
}
