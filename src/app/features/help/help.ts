import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../core/services/title.service';

interface FAQ {
    question: string;
    answer: string;
    open: boolean;
}

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './help.html',
    styleUrl: './help.scss'
})
export class HelpComponent implements OnInit {
    private titleService = inject(TitleService);

    faqs = signal<FAQ[]>([
        {
            question: 'How do I register a new patient?',
            answer: 'Navigate to the "Patients" section in the sidebar and click the "Add New Patient" button at the top right. Fill in the required details and click "Register".',
            open: false
        },
        {
            question: 'How can I assign a doctor to an admission?',
            answer: 'During the admission process, you can select a doctor from the "Assigned Doctor" dropdown in the Vitals section. Use the "Suggest Doctor" feature for AI-driven recommendations based on specialization.',
            open: false
        },
        {
            question: 'Where can I find financial reports?',
            answer: 'Access the "Reports" module from the sidebar. You will find various financial summaries, including "Revenue Summary" and "Billing Analytics", available for download.',
            open: false
        },
        {
            question: 'How do I update my profile settings?',
            answer: 'Click on your profile avatar in the top right corner and select "Settings", or use the "Settings" link in the sidebar to update your name, email, and preferences.',
            open: false
        }
    ]);

    categories = [
        { name: 'Getting Started', icon: 'rocket_launch' },
        { name: 'Patient Management', icon: 'person_search' },
        { name: 'Billing & Payments', icon: 'payments' },
        { name: 'System Security', icon: 'security' }
    ];

    ngOnInit() {
        this.titleService.setTitle('Help & Support Center');
    }

    toggleFaq(index: number) {
        this.faqs.update(list => {
            list[index].open = !list[index].open;
            return [...list];
        });
    }

    contactSupport() {
        alert('Connecting to MedNex Support... A support agent will be with you shortly.');
    }
}
