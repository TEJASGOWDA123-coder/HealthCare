import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LaboratoryService, LabRequest } from '../../core/services/laboratory.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-laboratory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './laboratory.html',
    styleUrl: './laboratory.scss'
})
export class LaboratoryComponent implements OnInit {
    private labService = inject(LaboratoryService);
    public authService = inject(AuthService);

    requests = signal<LabRequest[]>([]);
    filterStatus = signal<string>('All');

    // For uploading results
    showUploadModal = signal<boolean>(false);
    selectedRequest = signal<LabRequest | null>(null);
    resultText = signal<string>('');
    fileUrl = signal<string>('');

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.labService.getAllRequests().subscribe(data => {
            this.requests.set(data);
        });
    }

    filteredRequests() {
        const status = this.filterStatus();
        const all = this.requests();
        if (status === 'All') return all;
        return all.filter(r => r.status === status);
    }

    openUploadModal(request: LabRequest) {
        this.selectedRequest.set(request);
        this.showUploadModal.set(true);
    }

    closeUploadModal() {
        this.showUploadModal.set(false);
        this.selectedRequest.set(null);
        this.resultText.set('');
        this.fileUrl.set('');
    }

    submitResult() {
        const req = this.selectedRequest();
        if (!req || !req.id) return;

        this.labService.uploadResult(req.id, {
            resultText: this.resultText(),
            fileUrl: this.fileUrl()
        }).subscribe(() => {
            this.loadRequests();
            this.closeUploadModal();
        });
    }

    getStatusClass(status: string) {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'PROCESSING': return 'status-processing';
            case 'COMPLETED': return 'status-completed';
            default: return '';
        }
    }
}
