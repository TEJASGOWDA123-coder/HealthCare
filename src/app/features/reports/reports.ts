import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';

interface Report {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    lastGenerated: string;
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reports.html',
    styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {
    private titleService = inject(TitleService);

    reports = signal<Report[]>([
        {
            id: 'R001',
            title: 'Monthly Patient Census',
            description: 'Comprehensive breakdown of patient admissions, discharges, and occupancy rates.',
            category: 'Clinical',
            icon: 'groups',
            lastGenerated: 'Today, 09:00 AM'
        },
        {
            id: 'R002',
            title: 'Revenue Summary',
            description: 'Detailed financial report covering paid invoices, pending payments, and insurance claims.',
            category: 'Financial',
            icon: 'account_balance_wallet',
            lastGenerated: 'Yesterday'
        },
        {
            id: 'R003',
            title: 'Staff Performance Log',
            description: 'Metrics on consultation counts, average stay duration per doctor, and nurse shifts.',
            category: 'Operations',
            icon: 'engineering',
            lastGenerated: '2 days ago'
        },
        {
            id: 'R004',
            title: 'Inventory & Supplies',
            description: 'Stock levels for critical medical supplies, medication usage, and reorder alerts.',
            category: 'Logistics',
            icon: 'inventory_2',
            lastGenerated: 'Today, 08:30 AM'
        },
        {
            id: 'R005',
            title: 'Appointment Analytics',
            description: 'Analysis of no-show rates, peak consultation hours, and department demand.',
            category: 'Clinical',
            icon: 'calendar_month',
            lastGenerated: '3 days ago'
        }
    ]);

    ngOnInit() {
        this.titleService.setTitle('Reporting Center');
    }

    downloadReport(report: Report) {
        // Simulation: Mock download behavior
        alert(`Downloading ${report.title}... Your report will be ready in a moment.`);
    }

    generateNow(report: Report) {
        alert(`Regenerating ${report.title} with the latest data. Please wait...`);
    }
}
